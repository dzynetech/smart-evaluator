FROM python:3.8-slim-buster
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get -y install libpq-dev gcc 
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "geocode.py" ]