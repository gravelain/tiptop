pipeline {
    agent any
    environment {
        SONARQUBE_URL = 'http://sonarqube:9000'  // URL de ton serveur SonarQube
        SONARQUBE_TOKEN = credentials('sonarqube-token')  // Ton token configuré dans Jenkins
    }
    stages {
        stage('Checkout') {
            steps {
                // Cloner le dépôt GitHub
                git url: 'https://github.com/gravelain/tiptop.git', branch: 'main'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    echo 'Running SonarQube Analysis...'
                    sh """
                        docker run --rm \
                            -e SONARQUBE_URL=${env.SONARQUBE_URL} \
                            -e SONARQUBE_TOKEN=${env.SONARQUBE_TOKEN} \
                            -v \$(pwd):/usr/src \
                            sonarsource/sonar-scanner-cli
                    """
                }
            }
        }
        stage('Build') {
            steps {
                // Commandes de build ici
            }
        }
        stage('Test') {
            steps {
                // Commandes de test ici
            }
        }
        stage('Deploy') {
            steps {
                // Commandes de déploiement ici
            }
        }
    }
    post {
        success {
            echo 'Build réussi!'
        }
        failure {
            echo 'Build échoué!'
        }
    }
}
