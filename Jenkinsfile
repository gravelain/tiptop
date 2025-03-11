pipeline {
    agent any
    environment {
        SONARQUBE_URL = 'http://95.111.240.167:9000'
        SONARQUBE_TOKEN = credentials('sonarqube-token-last')
    }

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    echo '📦 Installation des dépendances Backend...'
                    dir('apps/backend') {
                        sh 'npm ci --omit=dev'
                    }
                    echo '📦 Installation des dépendances Frontend...'
                    dir('apps/frontend') {
                        sh 'npm ci --omit=dev'
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                script {
                    echo '🧪 Exécution des tests Backend (NestJS)...'
                    dir('apps/backend') {
                        sh 'npx jest --config=jest.config.js'
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                script {
                    echo '🧪 Exécution des tests Frontend (Next.js)...'
                    dir('apps/frontend') {
                        sh 'npx jest --config=jest.config.js --passWithNoTests'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo '🔎 Analyse SonarQube...'
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            npx sonar-scanner \
                                -Dsonar.host.url=${SONARQUBE_URL} \
                                -Dsonar.login=${SONARQUBE_TOKEN}
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    echo '🔎 Vérification du Quality Gate...'
                    timeout(time: 3, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    echo '⚙️ Compilation du Backend...'
                    dir('apps/backend') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo '⚙️ Compilation du Frontend...'
                    dir('apps/frontend') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo '🐳 Construction des images Docker...'
                    sh 'docker build -t thierrytemgoua98/mon-backend apps/backend'
                    sh 'docker build -t thierrytemgoua98/mon-frontend apps/frontend'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    echo '🐳 Connexion et push vers Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                                    usernameVariable: 'DOCKER_USER', 
                                                    passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker tag thierrytemgoua98/mon-backend thierrytemgoua98/mon-backend:latest
                            docker tag thierrytemgoua98/mon-frontend thierrytemgoua98/mon-frontend:latest
                            docker push thierrytemgoua98/mon-backend:latest
                            docker push thierrytemgoua98/mon-frontend:latest
                        """
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                }
                script {
                    echo '🚀 Déploiement en cours...'
                    sh './deploy.sh'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline terminé avec succès !'
            sh './scripts/backup.sh'
        }
        failure {
            echo '❌ Échec du pipeline !'
        }
    }
}
