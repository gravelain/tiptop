pipeline {
    agent any
    environment {
        SONARQUBE_URL = 'http://sonarqube:9000'
        SONARQUBE_TOKEN = credentials('sonarqube-token')
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
                        sh 'npm ci --omit=dev'
                    }
                    echo '📦 Installation des dépendances Frontend...'
                    dir('apps/frontend') {
                        sh 'npm ci --omit=dev'
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
                                -Dsonar.projectKey=tiptop \
                                -Dsonar.sources=apps/backend/src,apps/frontend/src \
                                -Dsonar.host.url=${SONARQUBE_URL} \
                                -Dsonar.login=${SONARQUBE_TOKEN}
                        '''
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

        stage('Test Backend') {
            steps {
                script {
                    echo '🧪 Exécution des tests Backend (NestJS)...'
                    dir('apps/backend') {
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

        stage('Docker Build & Push') {
            steps {
                script {
                    echo '🐳 Connexion au registre Docker...'
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            docker login -u $DOCKER_USER -p $DOCKER_PASS registry.example.com
                        """
                    }

                    echo '🐳 Construction et push de l’image Docker...'
                    sh """
                        docker build -t mon-backend apps/backend
                        docker build -t mon-frontend apps/frontend
                        docker tag mon-backend registry.example.com/mon-backend:latest
                        docker tag mon-frontend registry.example.com/mon-frontend:latest
                        docker push registry.example.com/mon-backend:latest
                        docker push registry.example.com/mon-frontend:latest
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
            emailext subject: '✅ Build réussi - ${JOB_NAME} #${BUILD_NUMBER}',
                     body: 'Le build de ${JOB_NAME} #${BUILD_NUMBER} a réussi.\nVoir les logs : ${BUILD_URL}',
                     recipientProviders: [developers()]
        }
        failure {
            echo '❌ Échec du pipeline !'
            emailext subject: '❌ Build échoué - ${JOB_NAME} #${BUILD_NUMBER}',
                     body: 'Le build de ${JOB_NAME} #${BUILD_NUMBER} a échoué.\nVoir les logs : ${BUILD_URL}',
                     recipientProviders: [developers()]
        }
    }
}
