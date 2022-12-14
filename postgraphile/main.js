const express = require("express");
const path = require("path");
const { postgraphile } = require("postgraphile");
const postgisPlugin = require("@graphile/postgis")
const PgSimplifyInflectorPlugin = require("@graphile-contrib/pg-simplify-inflector");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter")
const app = express();

app.use(
  postgraphile(
    process.env.LOCAL_DATABASE_URL ||
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/smart`,
    "smart",
    {
      appendPlugins: [
        postgisPlugin.default,
        ConnectionFilterPlugin,
        PgSimplifyInflectorPlugin,
      ],
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      retryOnInitFail: true,
      enableCors: true,
      pgDefaultRole: "smart_anonymous",
      jwtPgTypeIdentifier: "smart.jwt",
      jwtSecret: process.env.JWT_SECRET || "jwt_secret",
    }
  )
);

app.listen(process.env.PORT || 3000);