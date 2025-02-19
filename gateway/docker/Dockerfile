FROM openjdk:23-jdk-slim
WORKDIR /app
COPY gateway/build/libs/gateway.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
