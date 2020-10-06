FROM 817083319299.dkr.ecr.us-west-2.amazonaws.com/shifamed:container_image_fe-1.4
LABEL Name=shifamed_frontend Version=0.0.1

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/app
ADD compiled/ /usr/src/app

# expose port
EXPOSE 5000

# launch cmd
CMD serve -s build -p 5000
