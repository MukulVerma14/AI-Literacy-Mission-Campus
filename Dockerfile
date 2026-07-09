# ==========================================
# Stage 1: Build the application
# ==========================================
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy all your source code from GitHub into the Docker container
COPY . .

# Grant execution rights to the Gradle wrapper
RUN chmod +x ./gradlew

# Build the .jar file (skipping tests to speed up deployment)
RUN ./gradlew build -x test

# ==========================================
# Stage 2: Run the application
# ==========================================
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy ONLY the built .jar file from the 'builder' stage above
COPY --from=builder /app/build/libs/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]