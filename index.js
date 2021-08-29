require("dotenv").config();
const express = require("express");
const massive = require("massive");
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
//const fileUpload = require('express-fileupload');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.static('public'));
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// app.use(fileUpload({
//   createParentPath: true    
// }));//gets the file in the request

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Max-Age", "3600");
  next();
});


(async () => {
  const db = await massive(
    'postgres://tasgivscnohbpe:129b23998335b4a35d9839a2931718f3ef763031fbeb9f7a08ed3394415523c2@ec2-52-213-119-221.eu-west-1.compute.amazonaws.com:5432/d6b2bbinvsu58a?ssl=true'
  );
  app.set("db", db);
  app.use(bodyParser.json({ limit: '400mb', extended: true })); // parses application/json
  app.use(bodyParser.urlencoded({ limit: '400mb', extended: true })); // support encoded bodies


  // app.use(function (req, res) {
  //   res.setHeader('Content-Type', 'text/plain')
  //   res.write('you posted:\n')
  //   res.end(JSON.stringify(req.body, null, 2))
  // })

  //app.use(express.json({ limit: '25mb' }));
  //app.use(express.urlencoded({ limit: '25mb' }));
  app.use(fileUpload({ createParentPath: true }));

  const authorization = require("./src/middlewares/authorization.middleware");
  const table_router = require("./src/routes/table_router");
  const table_transaction_router = require("./src/routes/table_transaction_router");
  app.get("/v1/token/user_id/:user_id/password/:password", authorization.get_token);

  app.use("/v1", authorization.authorize_token);
  app.use("/v1/getUserMenu", authorization.get_user_menu);
  app.use("/v1/getUserItemsByRole", authorization.getUserItemsByRole);
  app.use("/v1/agency", table_router);
  app.use("/v1/transaction", table_transaction_router);

  app.use("*", function (req, res) {
    res.status(404).send({ status: "error", data: "Not Found!" });
  });
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log("jab_service is running in port: " + port);
  });
})();
