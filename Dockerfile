FROM node

# Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/

RUN yarn install

ENV  PATH="${PATH}:/node_modules/.bin"

COPY . /app/

# start command
CMD [ "node", "-r", "./apm.js", "./app.js" ]