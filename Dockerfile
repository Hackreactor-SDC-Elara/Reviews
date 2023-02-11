FROM node:18-alpine
WORKDIR /Reviews
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "start"]



