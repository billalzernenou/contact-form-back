const express = require("express");
const formidable = require("express-formidable");
require("dotenv").config();
const cors = require("cors");
const mailgun = require("mailgun-js");

const app = express();
app.use(formidable());
app.use(cors());

const DOMAIN = process.env.apiKey;
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

app.post("/form", (req, res) => {
  try {
    const form = {};
    form.firstName = req.fields.firstName;
    form.lastName = req.fields.lastName;
    form.email = req.fields.email;
    form.subject = req.fields.subject;
    form.message = req.fields.message;

    const data = {
      from: `${form.firstName} ${form.lastName} <${form.email}>`,
      to: "bzernenou@gmail.com",
      subject: form.subject,
      text: form.message,
    };

    mg.messages().send(data, function (error, body) {
      console.log(body);
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ mesage: "page not foud" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
