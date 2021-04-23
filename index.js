require("dotenv").config();
const express = require("express");
const massive = require("massive");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(fileUpload({
  createParentPath: true
}));//gets the file in the request

// app.use(function (req, res, next) {
//   var allowedOrigins = ['http://localhost:3200', 'http://localhost:8080', 'http://localhost:3000'];
//   var origin = req.headers.origin;
//   if (allowedOrigins.indexOf(origin) > -1) {
//     res.setHeader('Access-Control-Allow-Origin', "*");
//   }
//   res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', true);
//   return next();
// });


(async () => {
  const db = await massive({
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
  });
  app.set("db", db);
  app.use(bodyParser.json()); // parses application/json
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  const authorization = require("./src/middlewares/authorization.middleware");
  const table_router = require("./src/routes/table_router");
  const table_transaction_router = require("./src/routes/table_transaction_router");
  app.use("/v1/token", authorization.get_token);
  app.use("/v1", authorization.authorize_token);

  app.use("/v1/agency", table_router);
  app.use("/v1/transaction", table_transaction_router);

  //app.post("/v1/token", authorization.get_token);
  app.use("*", function (req, res) {
    res.status(404).send({ status: "error", data: "Not Found!" });
  });
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log("jab_service is running in port: " + port);
  });
})();
