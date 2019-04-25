FROM node:10-alpine
LABEL Name=shifamed_frontend Version=0.0.1

ARG REACT_APP_API_ENDPOINT
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -pv /usr/src/app
WORKDIR /usr/src/app

COPY src ./src/
COPY public ./public/
COPY package.json .
COPY tsconfig.json .
COPY tslint.json .
COPY yarn.lock .

# install dependencies 
RUN yarn install

# build the app
RUN yarn build

# expose port
EXPOSE 5000

# install serve
RUN yarn global add serve

# launch cmd
CMD serve -s build -p 5000