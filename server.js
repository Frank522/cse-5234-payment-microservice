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
function getData() {
  let result;
  
  axios({
    method: 'get',
    url: 'https://cse5234-order-microservice.herokuapp.com/OrderMicroservice/Order',
    responseType: 'json',
    withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(function (response) {
      //handle success
      console.error(response);
      console.error(response.status);  // ***
      console.error(response.headers); // ***
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });
  return result;
  
}

async function insertPaymentinfo(request, response) {
  client.connect();
  // const data = await axios.get('/OrderMicroservice/Order');
  // console.log(data);
  let payment = getData();
  // let payment = data;
  console.log("Log from interPayment",payment);
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
  // client.query(
  //   'INSERT INTO payment_entity (payment_id,business_entity,business_entity_aaccount) VALUES ($1,$2,$3);',
  //   [
  //     payment.id,
  //     payment.entity,
  //     payment.businessAccount
  //   ],
  //   (err, res) => {
  //     if (err) throw err;
  //     console.log(res);
  //     //client.end();
  //   }    
  // );
  
  // response.send("#015049");
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
