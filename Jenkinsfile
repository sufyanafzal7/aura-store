pipeline {
  agent any
  environment {
    DOCKERHUB = credentials('dockerhub-creds')
  }
  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/sufyanafzal7/aura-store.git'
      }
    }
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t aura-store .'
      }
    }
    stage('Push to Docker Hub') {
      steps {
        sh 'docker login -u $DOCKERHUB_USR -p $DOCKERHUB_PSW'
        sh 'docker tag aura-store sufyanafzal7/aura-store:latest'
        sh 'docker push sufyanafzal7/aura-store:latest'
      }
    }
    stage('Deploy with Compose') {
      steps {
        sh 'docker-compose down && docker-compose up -d'
      }
    }
  }
}
