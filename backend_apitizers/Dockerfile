# Use Maven image with OpenJDK 17 for the build stage
FROM maven:3.9.5-eclipse-temurin-21 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .

# Copy the source code
COPY src ./src

# Build the application and skip tests
RUN mvn clean package -DskipTests

# Use a lightweight OpenJDK image for the runtime stage
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/apitizers-0.0.1-SNAPSHOT.jar app.jar

# Expose the backend port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
