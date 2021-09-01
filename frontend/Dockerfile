FROM node:14 as build

WORKDIR /app

COPY ./react/package.json /app/package.json
COPY ./react/package-lock.json /app/package-lock.json

RUN npm install

COPY ./react .

RUN npm run build


FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/htpasswd /etc/nginx/.htpasswd

COPY --from=build /app/build /usr/share/nginx/html
