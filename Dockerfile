#Use official Node 20 image
FROM node:20-alpine

#Set working directory
WORKDIR /app

#Copy package.json and package-lock.json
COPY package*.json ./

#Copy the rest of the application code (needed for build during install)
COPY . .

#Install dependencies (includes prepare/build scripts)
RUN npm install

#Command to run the CLI application
CMD ["node", "dist/cli/index.js"]