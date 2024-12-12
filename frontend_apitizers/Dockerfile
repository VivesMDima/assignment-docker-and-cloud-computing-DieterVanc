# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install the new Expo CLI globally
RUN npm install -g expo

# Copy the rest of the application files
COPY . .

# Expose the port you want Expo to use for the web app
EXPOSE 3000

# Start Expo in web mode and set the port to 3000
CMD ["npx", "expo", "start", "--web", "--port", "3000"]
