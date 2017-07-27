const Bottleneck = require("bottleneck"),
      limiter = new Bottleneck(2, 1000),
      req = require('request-promise');

function limitedGetRequests(uriToCall) {
  return req({uri: uriToCall, json: true})
      .catch(err => console.log(err));
}
function limitedPostRequests(uriToCall, method, json) {
  return req({uri: uriToCall, body: json, method: method, json: true})
      .catch(err => console.log(err));
}

module.exports.get = function makeGetRequest(uriToCall) {
  return limiter.schedule(limitedGetRequests, uriToCall);
}
module.exports.post = function makePostRequest(uriToCall, json) {
  return limiter.schedule(limitedPostRequests, uriToCall, 'POST', json);
}
module.exports.put = function makePutRequest(uriToCall, json) {
  return limiter.schedule(limitedPostRequests, uriToCall, 'PUT', json);
}
