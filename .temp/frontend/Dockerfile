# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --save-dev @types/react-feather
RUN npm install

# Copy the rest of the application's code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# The command to start the app is specified in docker-compose.yml
CMD ["npm", "run", "dev"]
