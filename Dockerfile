# Use official Node.js LTS image
FROM node:22.9.0-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files first (for better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port of Line bot
EXPOSE 3000

# Start the app
CMD ["node", "src/app.js"]
