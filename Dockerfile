FROM mhart/alpine-node:latest
RUN npm install -g nodemon ts-node
RUN mkdir -p /var/www/server
WORKDIR /var/www
COPY package*.json /var/www/
RUN npm install
WORKDIR /var/www/server
CMD npm run sample 
