pipeline {
    agent none

    environment {
        // Variables Globales
        DOCKER_REGISTRY = 'thierrytemgoua98' // Ton nom d'utilisateur Docker Hub
        BACKEND_IMAGE_NAME = "${DOCKER_REGISTRY}/mon-backend"
        FRONTEND_IMAGE_NAME = "${DOCKER_REGISTRY}/mon-frontend"
        BRANCH_NAME = "${env.BRANCH_NAME}"
        BACKEND_CONTAINER_NAME = "backend"
        FRONTEND_CONTAINER_NAME = "frontend"
        SONARQUBE_URL = 'http://sonarqube.wk-archi-f24a-15m-g3.fr'
        SONARQUBE_TOKEN = credentials('sonarqube-token-last')
    }

    tools {
        nodejs 'NodeJS' // Définir l'environnement NodeJS si besoin
    }

    stages {

        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent parallel: true
            failFast true
            stages {
                stage('Backend Dependencies') {
                    agent {
                        docker {
                            image 'php:8.1-cli'
                            args '-v $PWD/apps/backend:/app'
                        }
                    }
                    steps {
                        dir('apps/backend') {
                            sh '''
                                apt-get update && apt-get install -y unzip git curl php-cli php-mbstring php-xml php-curl php-sqlite3 php-intl php-zip php-bcmath php-tokenizer
                                curl -sS https://getcomposer.org/installer | php
                                mv composer.phar /usr/local/bin/composer
                                composer install --no-interaction --no-progress --no-scripts
                            '''
                        }
                    }
                }

                stage('Frontend Dependencies') {
                    agent {
                        docker {
                            image 'node:16'
                            args '-v $PWD/apps/frontend:/app -v frontend_node_modules:/app/node_modules'
                        }
                    }
                    steps {
                        dir('apps/frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            agent parallel: true
            failFast true
            stages {
                stage('Backend Tests') {
                    agent {
                        docker {
                            image 'php:8.1-cli'
                            args '-v $PWD/apps/backend:/app'
                        }
                    }
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

                stage('Frontend Tests') {
                    agent {
                        docker {
                            image 'node:16'
                            args '-v $PWD/apps/frontend:/app -v frontend_node_modules:/app/node_modules'
                        }
                    }
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
            }
        }

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

        stage('Build') {
            agent parallel: true
            failFast true
            stages {
                stage('Build Frontend') {
                    agent {
                        docker {
                            image 'node:16'
                            args '-v $PWD/apps/frontend:/app -v frontend_node_modules:/app/node_modules'
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
                            image 'php:8.1-cli'
                            args '-v $PWD/apps/backend:/app'
                        }
                    }
                    steps {
                        dir('apps/backend') {
                            echo "Pas de compilation Symfony nécessaire"
                        }
                    }
                }
            }
        }

        stage('Build and Push Docker Images') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            agent any
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        def backendImage = "${BACKEND_IMAGE_NAME}:${BRANCH_NAME}"
                        def frontendImage = "${FRONTEND_IMAGE_NAME}:${BRANCH_NAME}"

                        sh '''
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker build -t ${backendImage} --build-arg APP_ENV=${BRANCH_NAME} apps/backend
                            docker build -t ${frontendImage} --build-arg APP_ENV=${BRANCH_NAME} apps/frontend
                            docker push ${backendImage}
                            docker push ${frontendImage}
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            agent any
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'ssh-credentials', usernameVariable: 'SSH_USER', passwordVariable: 'SSH_PASS')]) {
                        sh '''
                            sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@${env.SSH_HOST}" "
                              cd /opt/docker-compose &&
                              docker compose pull &&
                              docker compose up -d"
                        '''
                    }
                }
            }
        }

        stage('Cleanup') {
            agent any
            steps {
                sh 'docker system prune -f --volumes'
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