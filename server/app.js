require("babel-register");

const nodemailer = require('nodemailer')
var gzippo = require('gzippo')

var express = require('express')
const app = express()
const reCAPTCHA=require('recaptcha2')
const cors = require('cors')
const config = require('./config.json')
const supercrypt = require('./crypto.js')


const PUBLIC_KEY  = '6LcveB8UAAAAAPxX2BE77vz2jfZ0te3Ku6L50QKt'
const PRIVATE_KEY = '6LcveB8UAAAAAMYqK9xJoy_2_12gxaOw5GUQbE9a'

recaptcha = new reCAPTCHA({
  siteKey: PUBLIC_KEY,
  secretKey: PRIVATE_KEY
});

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies

app.use(cors());


const emailLabs = {
    host: 'smtp.emaillabs.net.pl',
    auth: {
        user: '1.axissoft.smtp',
        pass: 'DP92R8B'
    }
};

const gmailConfig = {
    service: 'gmail',
    auth: {
        user: supercrypt.decrypt(config.user),
        pass: supercrypt.decrypt(config.password)
    }
}

const transporter = nodemailer.createTransport(emailLabs);


function sendEmail(req, res) {
    const mailOptions = {
        from: '<' + req.body.contactEmail + '>', // sender address
        to: config.recipient, // list of receivers
        subject: req.body.contactSubject, // Subject line
        text: req.body.contactMessage // plain text body
    };
    //
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({message: 'Error sending email', error: error, info: info}).send();
        }
    });

    let response = req.body;
    delete response['g-recaptcha-response']
    res.json(response).send();

}


//check recaptcha
app.post('/', function(req, res, next) {

  recaptcha.validateRequest(req)
      .then(function() {
          console.log(req.body);
          console.log('Captcha valid next --->');
        // validated and secure
          next();

      })
      .catch(function(errorCodes){
        // invalid
          console.log(errorCodes);
          res.status(500).json({message: recaptcha.translateErrors(errorCodes)}).send();
      });
}, sendEmail);

app.use(gzippo.staticGzip("" + __dirname + "/../client/app"));

const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log('Example app listening on port '+port)
})
