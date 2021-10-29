var express = require("express");
var app = express();
const port = process.env.PORT || 3000;

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

//client.connect();



var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Example app listening at ${host}:${port}`);
});
