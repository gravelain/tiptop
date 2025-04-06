pipeline {
    agent none  // Pas d'agent global ici, nous allons définir un agent pour chaque stage

    environment {
        BRANCH_NAME = "${env.BRANCH_NAME}"
        SONARQUBE_URL = 'http://sonarqube.wk-archi-f24a-15m-g3.fr'
        SONARQUBE_TOKEN = credentials('sonarqube-token-last') // Token SonarQube
    }

    tools {
        nodejs 'NodeJS' // Définir l'environnement NodeJS si besoin
    }

    stages {
        // ─────── 🔧 INSTALL ───────
        stage('Install Backend Dependencies (Symfony)') {
            agent {
                docker {
                    image 'php:8.1-cli'  // Image Docker PHP 8.1
                    args '-v /tmp:/tmp'  // Monter un volume temporaire si nécessaire
                }
            }
            steps {
                dir('apps/backend') {
                    sh '''
                        apt-get update && apt-get install -y unzip git curl php-cli php-mbstring php-xml php-curl php-sqlite3 php-intl php-zip php-bcmath php-tokenizer
                        curl -sS https://getcomposer.org/installer | php
                        mv composer.phar /usr/local/bin/composer
                        composer install
                    '''
                }
            }
        }

        stage('Install Frontend Dependencies (Angular)') {
            agent {
                docker {
                    image 'node:16'  // Image Docker Node.js
                    args '-v /tmp:/tmp'  // Monter un volume temporaire si nécessaire
                }
            }
            steps {
                dir('apps/frontend') {
                    sh 'npm ci'
                }
            }
        }

        // ─────── 🧪 TESTS ───────
        stage('Run Backend Tests (PHPUnit)') {
            agent {
                docker {
                    image 'php:8.1-cli'  // Utilisation de PHP pour le backend
                    args '-v /tmp:/tmp'  // Monter un volume temporaire si nécessaire
                }
            }
            steps {
                dir('apps/backend') {
                    timeout(time: 10, unit: 'MINUTES') {
                        sh './bin/phpunit --coverage-html coverage'
                    }
                }
            }
            post {
                always {
                    publishHTML(target: [
                        reportName: 'Backend Coverage Report',
                        reportDir: 'apps/backend/coverage',
                        reportFiles: 'index.html',
                        keepAll: true,
                        allowMissing: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        stage('Run Frontend Tests') {
            agent {
                docker {
                    image 'node:16'  // Image Docker Node.js pour exécuter les tests frontend
                    args '-v /tmp:/tmp'  // Monter un volume temporaire si nécessaire
                }
            }
            steps {
                dir('apps/frontend') {
                    timeout(time: 10, unit: 'MINUTES') {
                        sh 'npm run test -- --watch=false --code-coverage'
                    }
                }
            }
            post {
                always {
                    publishHTML(target: [
                        reportName: 'Frontend Coverage Report',
                        reportDir: 'apps/frontend/coverage',
                        reportFiles: 'index.html',
                        keepAll: true,
                        allowMissing: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ─────── 🔎 SONARQUBE ANALYSIS ───────
        stage('SonarQube Analysis') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            agent {
                docker {
                    image 'node:16'  // Utilisation de Node.js pour l'analyse SonarQube
                    args '-v /tmp:/tmp'  // Monter un volume temporaire si nécessaire
                }
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'npx sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ─────── 🛠️ BUILD ───────
        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:16'  // Image Docker Node.js pour le build frontend
                    args '-v /tmp:/tmp'  // Monter un volume temporaire si nécessaire
                }
            }
            steps {
                dir('apps/frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            agent {
                docker {
                    image 'php:8.1-cli'  // Image Docker PHP pour le backend
                    args '-v /tmp:/tmp'  // Monter un volume temporaire si nécessaire
                }
            }
            steps {
                echo "Pas de compilation Symfony nécessaire"
            }
        }

        // ─────── 🐳 DOCKER + REGISTRY ───────
        stage('Push Docker Images') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            agent any  // Utilise un agent Jenkins classique ici
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker build -t thierrytemgoua98/mon-backend:${BRANCH_NAME} -f apps/backend/Dockerfile.${BRANCH_NAME} apps/backend
                        docker build -t thierrytemgoua98/mon-frontend:${BRANCH_NAME} -f apps/frontend/Dockerfile.${BRANCH_NAME} apps/frontend
                        docker push thierrytemgoua98/mon-backend:${BRANCH_NAME}
                        docker push thierrytemgoua98/mon-frontend:${BRANCH_NAME}
                    '''
                }
            }
        }

        // ─────── 🚀 DEPLOY ───────
        stage('Deploy Environment') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            agent any  // Utilise un agent classique Jenkins ici
            steps {
                script {
                    def deployScript = "./scripts/deploy_${env.BRANCH_NAME}.sh"
                    echo "Déploiement avec ${deployScript}"
                    sh deployScript
                }
            }
        }

        // ─────── 🧹 CLEANUP ───────
        stage('Cleanup Docker') {
            agent any  // Utilise un agent classique Jenkins ici
            steps {
                sh 'docker system prune -f'
            }
        }
    }

    post {
        success {
            script {
                try {
                    if (env.BRANCH_NAME == 'prod') {
                        echo 'Pipeline prod terminé avec succès. Lancement du backup...'
                        sh './scripts/backup.sh'
                    } else {
                        echo "✅ Pipeline terminée avec succès sur branche ${BRANCH_NAME}"
                    }
                } catch (Exception e) {
                    echo "Erreur lors de l'exécution du backup ou d'autres actions post : ${e.getMessage()}"
                    currentBuild.result = 'FAILURE'
                    throw e
                }
            }
        }
        failure {
            echo "❌ Échec de la pipeline sur branche ${BRANCH_NAME}"
        }
        always {
            echo "📦 Fin d’exécution de la pipeline"
        }
    }
}
