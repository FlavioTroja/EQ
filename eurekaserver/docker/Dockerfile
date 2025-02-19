FROM openjdk:21-jdk-slim
WORKDIR /app
COPY eurekaserver/build/libs/eurekaserver.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
