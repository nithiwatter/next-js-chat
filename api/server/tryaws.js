const AWS = require('aws-sdk');
const axios = require('axios');
const req = require('request');
const fs = require('fs');

const config = {
  accessKeyId: 'AKIAIQQIWAXBE6GONGAA',
  secretAccessKey: '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',
  region: 'ap-southeast-1',
};

AWS.config.update(config);

var s3 = new AWS.S3();
var params = {
  Bucket: 'next-js-chat-avatars',
  Key: 'excalibur/items/stark2.jpg',
  ContentType: '/jpg',
};
var url = s3.getSignedUrl('putObject', params);
fs.readFile(__dirname + '/server.js', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(url);
  axios.put(url, data, {
    headers: {
      'Content-Type': '/jpg',
    },
  });
});
