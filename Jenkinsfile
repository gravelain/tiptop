pipeline {
    agent any

    environment {
        BRANCH_NAME = "${env.BRANCH_NAME}"
        SONARQUBE_URL = 'http://sonarqube.wk-archi-f24a-15m-g3.fr'
        SONARQUBE_TOKEN = credentials('sonarqube-token-last')
    }

    tools {
        nodejs 'NodeJS'
    }

    options {
        skipDefaultCheckout(true)
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        // ─────── 🔄 CHECKOUT ───────
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        // ─────── 🔧 INSTALL ───────
        stage('Install Backend Dependencies (Symfony)') {
            steps {
                dir('apps/backend') {
                    sh '''
                        apt-get update && apt-get install -y unzip git curl php php-cli php-mbstring php-xml php-curl php-sqlite3 php-intl php-zip php-bcmath php-tokenizer
                        curl -sS https://getcomposer.org/installer | php
                        mv composer.phar /usr/local/bin/composer
                        composer install
                    '''
                }
            }
        }

        stage('Install Frontend Dependencies (Angular)') {
            steps {
                dir('apps/frontend') {
                    sh 'npm ci'
                }
            }
        }

        // ─────── 🧪 TESTS ───────
        stage('Run Backend Tests (PHPUnit)') {
            steps {
                dir('apps/backend') {
                    sh './bin/phpunit --coverage-html coverage'
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
            steps {
                dir('apps/frontend') {
                    sh 'npm run test -- --watch=false --code-coverage'
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

        // ─────── 🔎 SONARQUBE ───────
        stage('SonarQube Analysis') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
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
            steps {
                dir('apps/frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo "Pas de compilation Symfony nécessaire"
            }
        }

        // ─────── 🐳 DOCKER + REGISTRY ───────
        stage('Push Docker Images') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credential', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
            steps {
                sh 'docker system prune -f'
            }
        }
    }

    post {
        success {
            script {
                if (env.BRANCH_NAME == 'prod') {
                    echo 'Pipeline prod terminé avec succès. Lancement du backup...'
                    sh './scripts/backup.sh'
                } else {
                    echo "✅ Pipeline terminée avec succès sur branche ${BRANCH_NAME}"
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
