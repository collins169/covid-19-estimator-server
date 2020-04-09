/* jshint esversion: 8 */

const covid19ImpactEstimator = (data) => data;
const express = require('express');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.xml({
  limit: '1MB',
  xmlParseOptions: {
    normalize: true,
    normalizeTags: true,
    explicitArray: false,
    compact: true
  }
}));
app.use(cors());

// app.use((req, res, next) => {
//   const start = new Date();
//   res.on('finish', function () {
//     const end = new Date();
//     const duration = end - start;
//   if(!fs.existsSync(path.join(__dirname, 'log.json'))){
//     fs.writeFileSync(path.join(__dirname, 'log.json'), JSON.stringify([]));
//   }

//   if(!fs.existsSync(path.join(__dirname, 'log.txt'))){
//     fs.writeFileSync(path.join(__dirname, 'log.txt'), "");
//   }

//   let logFile = JSON.parse(fs.readFileSync(path.join(__dirname,'log.json'), 'utf8'));
//   const log = `${req.method}\t\t${req.path}\t\t${res.statusCode}\t\t${duration}ms`;
  
//   let data = JSON.stringify({log}, null, 2);
//   logFile.push(JSON.parse(data));
//   if (res.statusCode === 200) {
//       fs.writeFileSync(path.join(__dirname, 'log.json'), JSON.stringify(logFile, null, 2));
//       fs.appendFileSync(path.join(__dirname, 'log.txt'), log + '\n', 'utf8');
//   }
// });
//   next();
// });

app.use('/api/v1/on-covid-19', require('./routes/covidRouter'));

app.listen(port, () => console.log(`Running on port ${parseInt(port)}`));