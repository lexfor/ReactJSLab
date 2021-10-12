FROM node:14
WORKDIR /home/Lab
COPY package.json ./
RUN npm install
COPY ../.. .
EXPOSE 3000
CMD [ "npm", "start" ]
