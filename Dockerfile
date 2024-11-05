# Use the official Node.js image
FROM node:20.18.0

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock first to install dependencies
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Generate the Prisma client
RUN yarn prisma generate

# Build the application
RUN yarn run build

# Expose the port (adjust according to your backend's port)
EXPOSE 4000

# Command to run the backend server
CMD ["yarn", "dev"]
