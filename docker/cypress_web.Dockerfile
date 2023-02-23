# official node image but in shifa ECR repo
FROM 817083319299.dkr.ecr.us-west-2.amazonaws.com/codebuild:node_18.13.0

WORKDIR /opt/app

ARG REACT_APP_API_ENDPOINT
ARG REACT_APP_WORKER_API_ENDPOINT
ARG REACT_APP_REFRESH_TOKEN_VALIDITY_DAYS
ARG REACT_APP_AWS_COGNITO_CLIENT_ID
ARG REACT_APP_FRONTEND_URL
ARG REACT_APP_SIGNUP_DOMAIN_URL
ARG BROWSER
ARG PORT
ARG REACT_APP_THEME
ARG NODE_ENV
ARG REACT_APP_DATADOG_APPLICATION_ID
ARG REACT_APP_DATADOG_CLIENT_TOKEN
ARG REACT_APP_DATADOG_SAMPLE_RATE
ARG REACT_APP_DATADOG_ENABLED
ARG REACT_APP_CONSOLE_TOAST
ARG REACT_APP_PREVENT_DOC_TYPE_MANAGEMENT_EDIT

COPY package*.json ./
COPY yarn*.lock ./
COPY patches /opt/app/patches
COPY eslint /opt/app/eslint
RUN NODE_ENV="development" yarn install --frozen-lockfile && yarn cache clean

COPY src /opt/app/src
COPY public /opt/app/public
COPY tsconfig* /opt/app/

RUN yarn react-scripts --max_old_space_size=4096 build
COPY scripts/cypress_docker_run_web.sh /opt/app/scripts/

LABEL enlil_cypress=$FE_GIT_COMMIT_HASH

COPY src/data/buildInfo.json /opt/app/src/data/buildInfo.json

CMD ["bash","./scripts/cypress_docker_run_web.sh"]
