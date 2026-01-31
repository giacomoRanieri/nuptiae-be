# Use official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the app files
COPY . .

# Build the app
RUN pnpm build

# Expose the port
#EXPOSE 3001

# Start the application
CMD ["pnpm", "start:prod"]