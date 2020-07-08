FROM cypress/base:10.18.0
# RUN npm install -g yarn@1.22.4

WORKDIR /opt/app

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install --frozen-lockfile

COPY src /opt/app/src
COPY public /opt/app/public
COPY cypress /opt/app/cypress
COPY tsconfig* /opt/app/

COPY scripts/cypress_docker_run_node.sh /opt/app/scripts/

CMD ["bash","./scripts/cypress_docker_run_node.sh"]
