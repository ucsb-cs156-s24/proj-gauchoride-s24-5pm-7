
FROM bellsoft/liberica-openjdk-alpine:17.0.2

WORKDIR /app

ENV NODE_VERSION=16.20.0
RUN apk add curl
RUN apk add bash
RUN apk add maven
RUN apk add --no-cache libstdc++
# added line below
RUN apk add git
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# commented out for git commit info

#RUN node --version
#RUN npm --version

# This approach (copying entire directory including git info) 
# relies on the dokku setting:
#   dokku git:set appname keep-git-dir true

# commented out for git commit info

#COPY frontend /home/app/frontend
#COPY src /home/app/src
#COPY lombok.config /home/app
#COPY pom.xml /home/app

# added line below
COPY . /home/app

ENV PRODUCTION=true
RUN mvn -B -DskipTests -Pproduction -f /home/app/pom.xml clean package

ENTRYPOINT ["sh", "-c", "java -jar /home/app/target/*.jar"]
