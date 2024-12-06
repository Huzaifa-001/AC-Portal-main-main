pipeline {
    agent any
    tools { 
        nodejs "nodejs"
        dockerTool "docker"
    }    
    stages {       

        stage('Build') {
            steps {
                sh 'docker build --no-cache -t primeaccuracore/ui -f Dockerfile .'
            }
        }
        stage('Push and Deploy') {
            steps {                
                sh 'docker stop primeang_portal || true && docker rm primeang_portal || true'
                sh 'docker run -d --restart always --name primeang_portal -p 4200:80  primeaccuracore/ui:latest'
            }
        }
    }
}
