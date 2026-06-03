FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy entire project
COPY . .

WORKDIR /usr/src/app/backend

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
