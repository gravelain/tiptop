# Utiliser l'image officielle LTS de Jenkins
FROM jenkins/jenkins:lts

# Passer à l'utilisateur root pour installer Docker
USER root

# Installer Docker CLI pour que Jenkins puisse interagir avec Docker
RUN apt-get update && \
    apt-get install -y docker.io && \
    usermod -aG docker jenkins

# Passer à l'utilisateur jenkins pour éviter d'exécuter Jenkins en tant que root
USER jenkins

# Copier le fichier plugins.txt contenant la liste des plugins à installer
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

# Installer les plugins à partir du fichier plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
