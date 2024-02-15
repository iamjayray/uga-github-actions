# Use a base image with Jenkinsfile Runner
FROM jenkins/jenkinsfile-runner:latest

# Set the working directory to /workspace
WORKDIR /home/aqib/Documents/BitBucket_OneOrigin/adms-admissions-application-ui

# Copy the Jenkinsfile from your project to the working directory
COPY Jenkinsfile /home/aqib/Documents/BitBucket_OneOrigin/adms-admissions-application-ui/

# Set the entry point to run the Jenkinsfile
ENTRYPOINT ["jenkinsfile-runner"]
