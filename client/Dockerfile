# Step 1: Set the base image to node
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Install serve package to serve the build folder
RUN npm install -g serve

# Step 8: Expose the desired port
EXPOSE 5000

# Step 9: Start the application
CMD ["serve", "-s", "dist", "-l", "5000"]
