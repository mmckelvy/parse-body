'use strict';

const test = require('tape');
const http = require('http');
const path = require('path');
const querystring = require('querystring');

const parseBody = require('../parse-body');

function testParseBody() {
  test('parseBody() -- Should properly parse a POST body of JSON', function(t) {

    const server = http.createServer(function(req, res) {
      parseBody(req, 1e6, function handlePost(err, body) {
        if (err) {
          t.fail('Should not return an error');
          server.close();
          t.end();

        } else {
          t.deepEqual(
            body,
            {name: 'John Doe', city: 'Los Angeles', age: 31},
            'Successfully parsed the POST body'
          );
          res.end();
          server.close();
          t.end();
        }
      });
    });

    server.listen(3000, function() {
      console.log('Server started');
    });

    const postData = JSON.stringify({
      name: 'John Doe',
      city: 'Los Angeles',
      age: 31
    });

    const options = {
      protocol: 'http:',
      host: 'localhost',
      port: 3000,
      method: 'POST',
      path: '/preview-notebook',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const postReq = http.request(options);

    postReq.write(postData);
    postReq.end();
  });

  test('parseBody() -- Should properly parse a POST body querystring', function(t) {

    const server = http.createServer(function(req, res) {
      parseBody(req, 1e6, function handlePost(err, body) {
        if (err) {
          t.fail('Should not return an error');
          server.close();
          t.end();

        } else {
          t.deepEqual(
            body,
            {name: 'John Doe', city: 'Los Angeles', age: '31'},
            'Successfully parsed the POST body'
          );
          res.end();
          server.close();
          t.end();
        }
      });
    });

    server.listen(3000, function() {
      console.log('Server started');
    });

    const postData = querystring.stringify({
      name: 'John Doe',
      city: 'Los Angeles',
      age: 31
    });

    const options = {
      protocol: 'http:',
      host: 'localhost',
      port: 3000,
      method: 'POST',
      path: '/preview-notebook',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    const postReq = http.request(options);

    postReq.write(postData);
    postReq.end();
  });


  test('parseBody() -- Should 413 on too large a post body', function(t) {

    const server = http.createServer(function(req, res) {
      parseBody(req, 20, function handlePost(err, body) {
        if (err) {
          t.equal(err.httpCode, 413, 'Returned the proper code');
          res.end();
          server.close();
          t.end();

        } else {
          t.fail('Should have sent an error');
          res.end();
          server.close();
          t.end();
        }
      });
    });

    server.listen(3000, function() {
      console.log('Server started');
    });

    const postData = querystring.stringify({
      name: 'John Doe',
      city: 'Los Angeles',
      age: 31
    });

    const options = {
      protocol: 'http:',
      host: 'localhost',
      port: 3000,
      method: 'POST',
      path: '/preview-notebook',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const postReq = http.request(options);
    postReq.end(postData);
  });

  test('parseBody() -- Should parse to string if no headers are present', function(t) {

    const server = http.createServer(function(req, res) {
      parseBody(req, 1e6, function handlePost(err, body) {
        if (err) {
          t.fail('Should not return an error');
          server.close();
          t.end();

        } else {
          t.equal(
            body,
            'someSuperString',
            'Successfully parsed the POST body'
          );
          res.end();
          server.close();
          t.end();
        }
      });
    });

    server.listen(3000, function() {
      console.log('Server started');
    });

    const postData = 'someSuperString';

    const options = {
      protocol: 'http:',
      host: 'localhost',
      port: 3000,
      method: 'POST',
      path: '/preview-notebook',
      headers: {
        'Content-Length': postData.length
      }
    };

    const postReq = http.request(options);

    postReq.write(postData);
    postReq.end();
  });
}

module.exports = testParseBody;
