FROM python:3.10-slim-buster
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get -y install libpq-dev gcc 
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN pipx install rdwatch-cli

COPY . .

CMD [ "python3", "videogen.py" ]