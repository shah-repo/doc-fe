FROM node:12.9.1
RUN npm install -g yarn@1.22.4

WORKDIR /opt/app

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install --frozen-lockfile

COPY src /opt/app/src
COPY tsconfig* /opt/app/

RUN yarn react-scripts --max_old_space_size=4096 build
COPY scripts/cypress_docker_run_web.sh /opt/app/scripts/

CMD ["bash","./scripts/cypress_docker_run_web.sh"]
