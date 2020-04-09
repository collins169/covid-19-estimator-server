/* jshint esversion: 8 */

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const xmlBuilder = require('xmlbuilder');

const estimator = require('../utils/estimator');

router.post('/', async(req, res) => {
  // console.log(req.body);
  const data = req.body;
  const response = estimator(data);
  return res.status(200).json(response);
});

router.post('/json', async(req, res) => {
  // console.log(req.body);
  const data = req.body;
  const response = estimator(data);
  return res.status(200).json(response);
});

router.post('/xml', async(req, res) => {
  // console.log(req.body);
  const data = req.body;
  const response = estimator(data);
  res.setHeader('Content-Type', 'application/xml');
  const xml = xmlBuilder.create({
      response
  }).end({
      pretty: true
  });

  res.send(xml);
  return res;
});

router.get('/logs', async(req, res) => {
  let logFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..','log.json'), 'utf8'));
  return res.status(200).json(logFile);
});

module.exports = router;
