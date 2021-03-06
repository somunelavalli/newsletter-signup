const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;
console.log(process.env.mailchimp_APIKEY);
console.log(process.env.mailchimp_LISTKEY);
// console.log(mailchimpapikey);
// console.log(mailchimplistKey);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const fName = req.body.firstname;
  const lName = req.body.lastname;
  const mail = req.body.email;

  var data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us5.api.mailchimp.com/3.0/lists/${process.env.mailchimp_LISTKEY}`;
  const options = {
    method: "POST",
    auth: `somunelavalli:${process.env.mailchimp_APIKEY}`,
  };

  const request = https.request(url, options, (response) => {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
