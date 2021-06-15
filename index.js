const express = require("express");
const { postgraphile } = require("postgraphile");
const postgisPlugin = require("@graphile/postgis")
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter")
const app = express();

app.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres://postgres:postgres@postgres:5432/smart",
    "public",
    {
      appendPlugins: [
        postgisPlugin.default,
        ConnectionFilterPlugin,
      ],
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      retryOnInitFail: true,
    }
  )
);

app.listen(process.env.PORT || 3000);