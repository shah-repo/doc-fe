FROM 817083319299.dkr.ecr.us-west-2.amazonaws.com/shifamed:build_image_fe-1.1
LABEL Name=shifamed_frontend Version=0.0.1

ARG REACT_APP_API_ENDPOINT
ARG REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS
ARG REACT_APP_AWS_COGNITO_CLIENT_ID
ARG REACT_APP_FRONTEND_URL
ARG REACT_APP_SIGNUP_DOMAIN_URL
ARG REACT_APP_THEME

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/app
ADD compiled/ /opt/app/

# expose port
EXPOSE 5000

# install serve
RUN yarn global add serve

# launch cmd
CMD serve -s build -p 5000
