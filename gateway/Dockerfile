FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install -y
COPY . .
CMD ["npm", "start"]