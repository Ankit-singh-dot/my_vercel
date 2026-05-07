FROM ubuntu:focal 
RUN apt-get update 
RUN apt-get install -y curl 
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
RUN apt-get upgrade -y 
RUN apt-get install -y nodejs
RUN apt-get install git -y 
WORKDIR /home/app
COPY main.sh main.sh
COPY script.js script.js 
COPY package*.json package*.json
RUN npm install
RUN chmod +X main.sh
RUN chmod +X script.js 

ENTRYPOINT [ "/home/app/main.sh" ]