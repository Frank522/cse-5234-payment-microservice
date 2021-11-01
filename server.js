var express = require("express");
const http = require("https");
var app = express();

const { Client } = require("pg");

const port = process.env.PORT || 3000;

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
async function insertPayment(request, response) {
  let payment = request.body.payment;
  client.query(
    'INSERT INTO paymentinfo (id,creditcardnumber,expirationdate,cvvcode) VALUES ($1, $2, $3, $4);',
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
      "Garden",
      "077133956"
    ],
    (err, res) => {
      if (err) throw err;
      console.log(res);
      //client.end();
    }    
  );
  
  response.send("#015049");
}

//client.connect();
app
.route("/PaymentMicroservice/Payment")
.post(
  jsonParser,
  insertPayment
)


var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Example app listening at ${host}:${port}`);
});
