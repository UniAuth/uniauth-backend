FROM node:lts-alpine3.10

# Labels
LABEL maintainer="Yash Kumar Verma yk.verma2000@gmail.com"

# Document environment configurations
ENV PORT=80
ENV database ='mongodb://127.0.0.1:27017/authentico'

# Create Directory for the Container
WORKDIR /app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install

# Copy all other source code to work directory
COPY . .

# Build the project
RUN npm run build
# RUN docker compose up

# run the server
CMD ["npm", "run", "start:dev"] 

EXPOSE 80
