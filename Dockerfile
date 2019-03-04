FROM node:10-alpine
LABEL Name=shifamed_frontend Version=0.0.1

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -pv /usr/src/app
WORKDIR /usr/src/app

COPY src ./src/
COPY public ./public/
COPY package.json .
COPY tsconfig.json .
COPY tslint.json .

# install dependencies 
RUN npm install

# build the app
RUN yarn build

# expose port
EXPOSE 5000

# install serve
RUN npm install -g serve

# launch cmd
CMD serve -s build -p 5000