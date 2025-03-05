# Pull the base image
FROM node:21.4.0-alpine3.18

# Set the working directory
WORKDIR /usr/src/app

# Copy app dependencies to container
COPY package*.json ./

# Install dependencies
# RUN npm install -g nodemon
RUN npm install

# Copy code from host to container
COPY . .

# Expose Port
EXPOSE 4000


CMD ["node","server.js"]