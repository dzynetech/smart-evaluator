FROM node:16 as build

WORKDIR /app
ARG commit_hash
ENV REACT_APP_COMMIT_HASH=${commit_hash}

COPY ./react/package.json /app/package.json
COPY ./react/package-lock.json /app/package-lock.json

RUN npm install

COPY ./react .

RUN npm run build


FROM nginx
RUN rm /var/log/nginx/access.log

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html
