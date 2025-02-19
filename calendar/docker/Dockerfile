FROM openjdk:23-jdk-slim
WORKDIR /app
COPY calendar/build/libs/calendar.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
