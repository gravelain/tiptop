pipeline {
    agent any
    environment {
        SONARQUBE_URL = 'http://sonarqube:9000'
        SONARQUBE_TOKEN = credentials('sonarqube-token-last')
    }

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo '📥 Clonage du dépôt GitHub...'
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo '📦 Installation des dépendances Backend...'
                    dir('apps/backend') {
                        sh 'npm cache clean --force'
                        sh 'npm ci --omit=dev'
                    }
                    echo '📦 Installation des dépendances Frontend...'
                    dir('apps/frontend') {
                        sh 'npm cache clean --force'
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
                        sh 'npx jest'
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                script {
                    echo '🧪 Exécution des tests Frontend (Next.js)...'
                    dir('apps/frontend') {
                        sh 'CI=true npm test'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo '🔎 Analyse SonarQube en cours...'
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            npx sonar-scanner \
                                -Dsonar.projectKey=sonarqube_project \
                                -Dsonar.sources=apps/backend/src,apps/frontend/src,apps/frontend/src/app \
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
                    echo '🔎 Vérification du Quality Gate SonarQube...'
                    timeout(time: 3, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    echo '⚙️ Compilation du Backend (NestJS)...'
                    dir('apps/backend') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo '⚙️ Compilation du Frontend (Next.js)...'
                    dir('apps/frontend') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    echo '🐳 Connexion au registre Docker...'
                    // Connexion à Docker Hub avec ton nom d'utilisateur Docker
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                                    usernameVariable: 'DOCKER_USER', 
                                                    passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            docker login -u $DOCKER_USER -p $DOCKER_PASS
                        """
                    }

                    echo '🐳 Construction et push de l’image Docker...'
                    // Construction des images pour le backend et le frontend
                    sh """
                        docker build -t thierrytemgoua98/mon-backend apps/backend
                        docker build -t thierrytemgoua98/mon-frontend apps/frontend
                    """

                    // Tagging des images avec les bons tags
                    sh """
                        docker tag thierrytemgoua98/mon-backend thierrytemgoua98/mon-backend:latest
                        docker tag thierrytemgoua98/mon-frontend thierrytemgoua98/mon-frontend:latest
                    """

                    // Push des images vers Docker Hub
                    sh """
                        docker push thierrytemgoua98/mon-backend:latest
                        docker push thierrytemgoua98/mon-frontend:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo '🚀 Déploiement en cours...'
                    sh './deploy.sh'
                }
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
