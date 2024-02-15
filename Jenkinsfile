pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    docker.image('node:14').inside {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    docker.image('node:14').inside {
                        sh 'npm test'
                    }
                }
            }
        }
    }
}
