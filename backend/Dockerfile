# start by pulling the python image
FROM python:3.10-slim

RUN apt update

RUN groupadd -g 1000 python && \
    useradd -r -u 1000 -g python python

# copy every content from the local file to the image
#COPY  /
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# copy requirements.txt to the docker image
#COPY requirements.txt /app/requirements.txt

#RUN chown python:python /app

# switch working directory

ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3306
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=Demo%402022
ENV MYSQL_DB=utdb_camera_webhooks

COPY . /app/

# install requirements
#RUN pip install -r requirements.txt

USER 1000

# command to run on container start
CMD [ "python", "run.py" ]