var app = new (require('express'))();
var wt = require('webtask-tools');
var MongoClient = require('mongodb').MongoClient;
var MONGODB_URI = MONGODB_URI;

const RESPONSE = {
  OK : {
    statusCode : 200,
    message: "You have successfully subscribed to the newsletter!",
  },
  ERROR : {
    statusCode : 400,
    message: "Something went wrong. Please try again."
  }
};

app.post('/submit', submitApplication)


function submitApplication(req, res) {

  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      res.writeHead(400, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(RESPONSE.ERROR));
    } else {
      const answers = getAnswers(req)
      const applications = db.collection('auth0-webtask');
      applications.insert(answers);
      db.close();
      res.writeHead(200, { 'Content-Type': 'application/json'});
      res.end(JSON.stringify(RESPONSE.OK));
    }
  });
}

function getAnswers(req) {
  var answers = req.body.form_response.answers;
  const submission = {
    firstName: answers[0].text,
    lastName: answers[1].text,
    email: answers[2].email
  };

  return submission;
}

module.exports = wt.fromExpress(app)