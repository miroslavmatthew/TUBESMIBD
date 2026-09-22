FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy app files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]