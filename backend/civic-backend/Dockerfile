# syntax=docker/dockerfile:1
# ------------------------------------------------------------------------------
# Build Stage
# ------------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace/app

# Copy pom.xml and src
COPY pom.xml ./
COPY src src

# Build application jar
RUN mvn clean package -DskipTests

# ------------------------------------------------------------------------------
# Production Runtime Stage
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy compiled jar from builder
COPY --from=builder /workspace/app/target/civic-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
