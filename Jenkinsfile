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
                echo "📦 Installation des dépendances backend pour branche ${BRANCH_NAME}"
                dir('apps/backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo "📦 Installation des dépendances frontend pour branche ${BRANCH_NAME}"
                dir('apps/frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo "🧪 Exécution des tests backend..."
                dir('apps/backend') {
                    sh 'npm run test'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                echo "🧪 Exécution des tests frontend..."
                dir('apps/frontend') {
                    sh 'npm run test -- --passWithNoTests'
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
                echo '⚙️ Compilation du backend...'
                dir('apps/backend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '⚙️ Compilation du frontend...'
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
                        # Se connecter à Docker Hub avec le nom d'utilisateur et le mot de passe
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        
                        # Construire les images avec des tags appropriés pour la branche
                        docker build -t thierrytemgoua98/mon-backend:${BRANCH_NAME} apps/backend
                        docker build -t thierrytemgoua98/mon-frontend:${BRANCH_NAME} apps/frontend
                        
                        # Pousser les images vers Docker Hub
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
                    // On choisit le script de déploiement en fonction de la branche
                    def deployScript = ''
                    if (env.BRANCH_NAME == 'develop') {
                        deployScript = './scripts/deploy_develop.sh'
                    } else if (env.BRANCH_NAME == 'preprod') {
                        deployScript = './scripts/deploy_preprod.sh'
                    } else if (env.BRANCH_NAME == 'prod') {
                        deployScript = './scripts/deploy_prod.sh'
                    }
                    
                    echo "🚀 Déploiement sur VPS pour ${BRANCH_NAME}..."
                    sh deployScript
                }
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
