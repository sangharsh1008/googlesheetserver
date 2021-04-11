const { GoogleSpreadsheet } = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1VqCV9FvkUBohb7Ob8EimriBppaTJfaBmKInLdiBFi0I');

// Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication

const RAW_DATA={
    name: "test1",
    taluka: "tq1",
    mobile: "94",
    dist: "",
    village: "",
    designation: "",
}

const getData=async()=>{
await doc.useServiceAccountAuth({
  client_email: creds.client_email,
  private_key: creds.private_key,
});

await doc.loadInfo(); // loads document properties and worksheets


const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]


// adding / removing sheets
await sheet.addRow(RAW_DATA);

}

const express = require('express')
var bodyParser = require('body-parser')

const app = express()
const port = 3000
app.use(bodyParser.json())

app.get('/', (req, res) => {

    console.log(req.body)
    res.send('successed')
})

app.post('/addRow', (req, res) => {

    console.log(req.body)
    res.send('success')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})