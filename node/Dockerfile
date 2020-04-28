FROM node:12

WORKDIR /use/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 8088

CMD ["npm","start"]