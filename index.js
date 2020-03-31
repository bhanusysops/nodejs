var express = require('express');
var AWSXRay = require('aws-xray-sdk');
var logger = require('winston');
 
var rules = {
  "rules": [ { "description": "Player moves.", "service_name": "*", "http_method": "*", "url_path": "/*", "fixed_target": 0, "rate": 0.05 } ],
  "default": { "fixed_target": 1, "rate": 0.1 },
  "version": 1
  };
 
var disable_rules = {
  "rules": [ { "description": "Disable Rules", "service_name": "*", "http_method": "*", "url_path": "/*", "fixed_target": 0, "rate": 0 } ],
  "default": { "fixed_target": 1, "rate": 0 },
  "version": 1
  };
 
var app = express();
 
AWSXRay.setLogger(logger);
AWSXRay.enableAutomaticMode;
AWSXRay.setDaemonAddress('3.227.17.200:2000');
AWSXRay.middleware.disableCentralizedSampling();
AWSXRay.middleware.setSamplingRules(rules);
console.log('Is xray automatic mode ', AWSXRay.isAutomaticMode());
 
app.use(AWSXRay.express.openSegment('aws-xray-nodejs'));
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use(AWSXRay.express.closeSegment('aws-xray-nodejs'));
 
app.get("/api/debug/true", function(req, res) {
  console.log("Debug Enabled");
  AWSXRay.middleware.setSamplingRules(rules);
  res.send("Debug Enabled");
});
 
app.get("/api/debug/false", function(req, res) {
  console.log("Debug Disabled");
  AWSXRay.middleware.setSamplingRules(disable_rules);
  res.send("Debug Disabled");
});
 
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
