FROM openjdk:21-jdk-slim
WORKDIR /app
COPY build/libs/eurekaserver.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
