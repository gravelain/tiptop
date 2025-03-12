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
        stage('Install Dependencies') {
            steps {
                echo "📦 Installation des dépendances pour branche ${BRANCH_NAME}"
                dir('apps/backend') {
                    sh 'npm ci --omit=dev'
                }
                dir('apps/frontend') {
                    sh 'npm ci --omit=dev'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "🧪 Exécution des tests..."
                dir('apps/backend') {
                    sh 'npx jest --config=jest.config.js'
                }
                dir('apps/frontend') {
                    sh 'npx jest --config=jest.config.js --passWithNoTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { ['develop', 'preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
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

        stage('Build Apps') {
            steps {
                echo '⚙️ Compilation backend et frontend...'
                dir('apps/backend') {
                    sh 'npm run build'
                }
                dir('apps/frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build & Push Docker Images') {
            when {
                expression { ['preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials',
                                                 usernameVariable: 'DOCKER_USER',
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker build -t thierrytemgoua98/mon-backend apps/backend
                        docker build -t thierrytemgoua98/mon-frontend apps/frontend
                        docker push thierrytemgoua98/mon-backend
                        docker push thierrytemgoua98/mon-frontend
                    '''
                }
            }
        }

        stage('Deploy') {
            when {
                expression { ['preprod', 'prod'].contains(env.BRANCH_NAME) }
            }
            steps {
                echo "🚀 Déploiement sur VPS pour ${BRANCH_NAME}..."
                sh './scripts/deploy.sh'
            }
        }
    }

    post {
        success {
            script {
                if (env.BRANCH_NAME == 'prod') {
                    echo '✅ Pipeline prod terminé avec succès. Lancement backup...'
                    sh './scripts/backup.sh'
                } else {
                    echo "✅ Pipeline terminé sur branche ${BRANCH_NAME}"
                }
            }
        }
        failure {
            echo "❌ Pipeline échoué sur branche ${BRANCH_NAME}"
        }
    }
}
