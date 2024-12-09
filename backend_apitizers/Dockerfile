# Use OpenJDK as the base image
FROM openjdk:23-jdk

# Set the working directory
WORKDIR /app

# Copy the application JAR file
COPY target/*.jar app.jar
COPY .env .env
COPY apitizers-292a3-firebase-adminsdk-v0e0m-121067aca5.json /app/

# Expose the backend port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
