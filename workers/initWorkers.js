var express = require('express');
var AWS = require('aws-sdk');
var partials = require('express-partials');
var port = 8000;
var key = 'AWS_Key';
var sec = 'AWS_Secret';

var elasticbeanstalk = new AWS.ElasticBeanstalk({accessKeyId: key, 
  secretAccessKey: sec, region: 'us-west-2'});

var params = {
  ApplicationName: 'SotgWorker',
  Description: 'Initialize Worker',
  AutoCreateApplication: true,
  VersionLabel: '1.0',
  SourceBundle: {
      S3Bucket: 'S3Bucket_name',
      S3Key: 'Zipfile'
  }
};

var params2 = {
  ApplicationName: 'SotgWorker', /* required */
  EnvironmentName: 'workerEnvironment',
  VersionLabel: '1.0',
  SolutionStackName: '64bit Amazon Linux 2015.03 v1.4.4 running Node.js'
};


var testEb = function(){
    elasticbeanstalk.createApplicationVersion(params, function(err, data) {
    if (err){
    console.log(err, err.stack);
    } else{
      console.log(data);
      elasticbeanstalk.createEnvironment(params2, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
    }
  });
};

var app = express();
app.use(partials());
app.use(express.bodyParser());
//get request for testing purposes
app.get('/test', testEb);
app.listen(port);
