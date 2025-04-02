pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        IMAGE_NAME = 'furiousducks6/angular-app'
        DOCKER_CREDENTIALS_ID = 'docker-hub'
        SLACK_CHANNEL = '#social'
        SLACK_CREDENTIALS_ID = 'slack'
        WORKDIR = '/usr/src/app'
        BRANCH_NAME = '' // Define a global variable for the branch name
    }

    stages {
        
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    BRANCH_NAME = env.GIT_BRANCH ?: sh(script: 'git rev-parse --abbrev-ref HEAD || echo "detached"', returnStdout: true).trim()
                    echo "Current branch: ${BRANCH_NAME}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker-compose -f ${COMPOSE_FILE} build"
                    }
                }
            }
        }

        stage('Deploy to Dev') {
    when {
        expression {

            return BRANCH_NAME == 'origin/develop' // Use the global variable
        }
    }
    steps {
        script {
            sh "docker-compose -f ${COMPOSE_FILE} up -d"
        }
    }
}

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        def imageTag = 'latest-dev'
                        sh "docker tag ${IMAGE_NAME}:${imageTag} ${IMAGE_NAME}:latest"
                        sh "docker push ${IMAGE_NAME}:${imageTag}"
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
    success {
        script {
            echo "Success"
        }
    }
    failure {
        script {
            echo "Failure"
        }
    }
}

}
