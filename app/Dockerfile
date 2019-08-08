FROM node

RUN mkdir /src

RUN npm install nodemon -g
RUN npm install pm2 -g

WORKDIR /src
ADD package.json package.json
RUN npm install

ADD nodemon.json nodemon.json
