FROM node:15.3.0-alpine3.10

# Labls
LABEL maintainer="Yash Kumar Verma yk.verma2000@gmail.com"

# Document environment configurations
ENV PORT=80
ENV database ='mongodb://127.0.0.1:27017/authentico'

# Create Directory for the Container
WORKDIR /src/app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install

# Copy all other source code to work directory
ADD . /src/app

# Build the project
RUN npm run build
RUN docker compose up

# run the server
CMD ["npm", "start:dev"] 

EXPOSE 80