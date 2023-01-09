FROM python:3.10-slim-buster
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get -y install libpq-dev gcc ffmpeg
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN pip3 install rdwatch-cli --find-links https://resonantgeodata.github.io/RD-WATCH/

COPY . .

CMD [ "python3", "moviegen.py" ]