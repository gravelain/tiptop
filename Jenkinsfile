pipeline {
    agent any

    environment {
        BRANCH_NAME = "${env.BRANCH_NAME}"
        SONARQUBE_URL = 'http://95.111.240.167:9000'
        SONARQUBE_TOKEN = credentials('sonarqube-token-last')
    }

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Install Backend Dependencies') {
            steps {
                echo "Nettoyage et installation des dépendances backend"
                dir('apps/backend') {
                    sh 'rm -rf node_modules coverage package-lock.json && npm ci'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo "Nettoyage et installation des dépendances frontend"
                dir('apps/frontend') {
                    sh 'rm -rf node_modules coverage package-lock.json && npm ci'
                }
            }
        }

        stage('Run Backend Tests + Coverage') {
            steps {
                echo "Tests backend avec couverture"
                dir('apps/backend') {
                    sh 'npm run coverage'
                }
            }
            post {
                always {
                    publishHTML(target: [
                        reportName : 'Backend Coverage Report',
                        reportDir  : 'apps/backend/coverage',
                        reportFiles: 'index.html',
                        keepAll    : true,
                        allowMissing: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        stage('Run Frontend Tests + Coverage') {
            steps {
                echo "Tests frontend avec couverture"
                dir('apps/frontend') {
                    sh 'npm run coverage'
                }
            }
            post {
                always {
                    publishHTML(target: [
                        reportName : 'Frontend Coverage Report',
                        reportDir  : 'apps/frontend/coverage',
                        reportFiles: 'index.html',
                        keepAll    : true,
                        allowMissing: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
                echo 'Analyse SonarQube...'
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

        stage('Build Backend') {
            steps {
                echo 'Compilation du backend...'
                dir('apps/backend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Compilation du frontend...'
                dir('apps/frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Push Docker Images') {
            when {
                expression { ['develop','preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credential', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo "Connexion Docker avec l'utilisateur $DOCKER_USER..."
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker build -t thierrytemgoua98/mon-backend:${BRANCH_NAME} apps/backend
                        docker build -t thierrytemgoua98/mon-frontend:${BRANCH_NAME} apps/frontend
                        docker push thierrytemgoua98/mon-backend:${BRANCH_NAME}
                        docker push thierrytemgoua98/mon-frontend:${BRANCH_NAME}
                    '''
                }
            }
        }

        stage('Deploy') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
                script {
                    def deployScript = ''
                    if (env.BRANCH_NAME == 'develop') {
                        deployScript = './scripts/deploy_develop.sh'
                    } else if (env.BRANCH_NAME == 'preprod') {
                        deployScript = './scripts/deploy_preprod.sh'
                    } else if (env.BRANCH_NAME == 'prod') {
                        deployScript = './scripts/deploy_prod.sh'
                    }

                    echo "Déploiement en cours pour la branche ${BRANCH_NAME}..."
                    sh deployScript
                }
            }
        }
    }

    post {
        success {
            script {
                if (env.BRANCH_NAME == 'prod') {
                    echo 'Pipeline prod terminé avec succès. Lancement backup...'
                    sh './scripts/backup.sh'
                } else {
                    echo "Pipeline terminé avec succès sur branche ${BRANCH_NAME}"
                }
            }
        }
        failure {
            echo "Pipeline échoué sur branche ${BRANCH_NAME}"
        }
    }
}
