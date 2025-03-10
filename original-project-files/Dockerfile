FROM node:alpine

WORKDIR /src/app

COPY . /src/app/

RUN npm install

# Update this when production build is working
CMD ["npm", "run", "dev"]