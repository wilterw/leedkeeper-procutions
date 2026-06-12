# Use Node 18
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and prisma
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
