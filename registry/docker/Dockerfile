FROM openjdk:21-jdk-slim
WORKDIR /app
COPY registry/build/libs/registry.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
