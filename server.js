var express = require("express");
const http = require("https");
var app = express();
const axios = require('axios');
const { Client } = require("pg");

const port = process.env.PORT || 3003;

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const cors = require("cors");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
app.use(
  cors({
    origin: "*",
  })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  next();
});

async function insertPaymentinfo(request, response) {
  client.connect();
  let payment = request.body.payment;
  let data = request.body;
  console.log("Log from interPayment",payment);
  client.query(
    'INSERT INTO payment (id,creditcardnumber,expirationdate,cvvcode) VALUES ($1, $2, $3, $4);',
    [
      payment.id,
      payment.creditCardNumber,
      payment.expirationDate,
      payment.cvvCode,
    ],
    (err, res) => {
      if (err) throw err;
      console.log(res);
      //client.end();
    }
  );
  client.query(
    'INSERT INTO payment_entity (payment_id,business_entity,business_entity_aaccount) VALUES ($1,$2,$3);',
    [
      payment.id,
      data.entity,
      data.businessAccount
    ],
    (err, res) => {
      if (err) throw err;
      console.log(res);
      //client.end();
    }    
  );
  let result = {
    confirm: "BP015049",
    id: payment.id
  };
  response.send(result);

}

//client.connect();

app
.route("/PaymentMicroservice/Payment")
.post(
  jsonParser,
  function(req, res) {
    console.log("Run insertpaymentinfo Function");
    insertPaymentinfo(req, res);
  }
)


var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Example app listening at ${host}:${port}`);
});
