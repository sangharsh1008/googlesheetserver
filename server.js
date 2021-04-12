const addUser = function(req, res) {
  const fs = require("fs");
  let usersData = {};
  fs.readFile("./userList.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    usersData = JSON.parse(jsonString);
    const userNames = usersData.users.map(value => value.name);
    if (!userNames.includes(req.body.name)) {
      usersData.users.push({
        name: req.body.name,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        password: req.body.password
      });
      console.log(usersData, JSON.stringify(usersData));
      fs.writeFile("./userList.json", JSON.stringify(usersData), err => {
        if (err) {
          res.send({ successful: false, message: "Error writing file" });
        } else {
          res.send({ successful: true, message: "Successfully wrote file" });
        }
      });
    } else {
      res.send({ successful: false, message: "User is already registered" });
    }
  });
};

var express = require("express");

const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
var app = express();

var port = process.env.PORT || 8081;

app.use(bodyParser.json());

app.use(express.static(__dirname + "/build"));

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/login", (req, res) => {
  let usersData = {};
  fs.readFile("./userList.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    usersData = JSON.parse(jsonString);
    console.log("File data:", JSON.parse(jsonString).users);

    const userNames = usersData.users.map(value => value.email);
    const passwords = usersData.users.map(value => value.password);
    if (
      userNames.includes(req.body.id) &&
      passwords.includes(req.body.password)
    ) {
      res.send({ successful: true });
    } else {
      res.send({ successful: false });
    }
  });
});

app.post("/addUser", addUser);

app.post("/testData", function(req, res) {
  console.log("res", req.body);
  res.send("testData");
});

app.post("/getSyllabus", function(req, res) {
  console.log("res", req.body);
  if (req.body.subject && req.body.class) {
    res.sendFile(
      path.join(
        __dirname,
        "syllabus/" + req.body.class,
        "/" + req.body.subject.toLocaleLowerCase() + ".pdf"
      )
    );
  }
});

app.post("/getBooks", function(req, res) {
  console.log("res", req.body);
  if (req.body.subject && req.body.class) {
    res.sendFile(
      path.join(
        __dirname,
        "books/" + req.body.class,
        "/" + req.body.subject.toLocaleLowerCase() + ".pdf"
      )
    );
  }
});

app.post("/getAssessment", function(req, res) {
  console.log("res", req.body);
  const question = {};
  fs.readFile(
    path.join(
      __dirname,
      "assessment/" + req.body.class,
      "/" + req.body.subject.toLocaleLowerCase() + ".txt"
    ),
    (err, data) => {
      if (err) throw err;
      let splitted = data.toString().split("\n");
      let count = 0;
      let qutionNo = 1;
      let optionArr = [];
      let optCount = 1;
      let correctAns = null;
      for (let i = 0; i < splitted.length - 1; i++) {
        if (i !== count) {
          if (splitted[i].startsWith("opt")) {
            optionArr.push(splitted[i].replace(["opt" + optCount], ""));
            optCount++;
          } else {
            correctAns = splitted[i].replace(["Answer"], "");
          }
        } else {
          Object.assign(question, {
            ["question" + qutionNo]: {
              question: splitted[i].replace("question ", "")
            }
          });
          optionArr = [];
          count += 6;
          optCount = 1;
          qutionNo += 1;
        }
        question["question" + (qutionNo - 1)] &&
          Object.assign(question["question" + (qutionNo - 1)], {
            option: optionArr,
            correctAnswer: Number(correctAns)
          });
      }
      res.send(question);
    }
  );
});

app.listen(port, function() {
  console.log("app Running");
});


//================================================================================================
const { GoogleSpreadsheet } = require('google-spreadsheet');
var creds = require('./client_secret.json');
var cors = require('cors')
// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1VqCV9FvkUBohb7Ob8EimriBppaTJfaBmKInLdiBFi0I');

// Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication

const RAW_DATA={
    name: "test123456",
    taluka: "tq1123",
    mobile: "94123",
    district: "123",
    village: "212",
    designation: "112312",
}

const getData=async(rowData)=>{
await doc.useServiceAccountAuth({
  client_email: creds.client_email,
  private_key: creds.private_key,
});

await doc.loadInfo(); // loads document properties and worksheets


const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

await sheet.addRow(rowData);

}

app.use(cors())
  
app.post('/addRow', (req, res) => {
  getData(req.body)
    console.log(req.body)
    res.send('success')
})