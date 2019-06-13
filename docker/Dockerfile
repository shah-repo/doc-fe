FROM node:10-alpine
LABEL Name=shifamed_frontend Version=0.0.1

ARG REACT_APP_API_ENDPOINT
ARG REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS
ARG REACT_APP_AWS_COGNITO_CLIENT_ID
ARG REACT_APP_FRONTEND_URL
ARG REACT_APP_SIGNUP_DOMAIN_URL
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -pv /usr/src/app
WORKDIR /usr/src/app

COPY src ./src/
COPY public ./public/
COPY package.json .
COPY tsconfig.json .
COPY tslint.json .
COPY yarn.lock .
COPY aws/bash_scripts/runTests.sh runTests.sh
COPY public/status.html ./public/status.html

RUN chmod a+x runTests.sh

# install dependencies 
RUN yarn install
RUN yarn add jest-junit

# build the app
RUN yarn build

# expose port
EXPOSE 5000

# install serve
RUN yarn global add serve

# launch cmd
CMD serve -s build -p 5000