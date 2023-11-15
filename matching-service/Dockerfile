FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 8001
CMD ["npm", "start"]