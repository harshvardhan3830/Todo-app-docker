# Step 1: Build the React application
# Use official Node.js image as a base image for the build stage
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies (including Vite)
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app (production build)
RUN npm run build

# Step 2: Serve the built application with a lightweight web server
# Use a lightweight web server image (nginx in this case)
FROM nginx:alpine

# Copy the build folder from the previous step into the nginx server's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default port for nginx)
EXPOSE 80

# Start nginx (default command)
CMD ["nginx", "-g", "daemon off;"]