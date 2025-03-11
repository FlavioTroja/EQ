FROM openjdk:21-jdk-slim
WORKDIR /app
COPY document/build/libs/document.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
