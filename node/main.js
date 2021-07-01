const express = require("express");
const path = require("path");
const { postgraphile } = require("postgraphile");
const postgisPlugin = require("@graphile/postgis")
const PgSimplifyInflectorPlugin = require("@graphile-contrib/pg-simplify-inflector");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter")
const app = express();

app.use(
  postgraphile(
    process.env.DATABASE_URL ||
      "postgres://postgres:postgres@postgres:5432/smart",
    "public",
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
    }
  )
);
app.use(express.static("frontend"));

app.listen(process.env.PORT || 3000);