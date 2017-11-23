FROM anapsix/alpine-java:8
ENV PORT="8084"
ENV PROFILE="default"
VOLUME /tmp
ADD bank-accounts.jar app.jar
RUN bash -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Dserver.port=${PORT}", "-Dspring.profiles.active=${PROFILE}", "-jar","/app.jar"]