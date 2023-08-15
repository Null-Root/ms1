# Build stage
FROM node:alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript code (if required)
RUN npm run build

# Final stage
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from build stage
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm install --production

# Copy built application files from build stage
COPY --from=build /app/dist ./dist

# Expose port 9000
EXPOSE 9000

# Start the application
CMD ["npm", "start"]
