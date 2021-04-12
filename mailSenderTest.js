  // const users = require('./userList.json')
const fs=require('fs')

  fs.readFile('./userList.json', 'utf8', (err, jsonString) => {
      if (err) {
          console.log("File read failed:", err)
          return
      }

      console.log('File data:', JSON.parse(jsonString).users)
  })
