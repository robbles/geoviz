var express = require('express');
var router = express.Router();
var events = require('../events');

// Main page
router.get('/', function(req, res) {
  res.render('index.html', { title: 'Express' });
});

// Long-running SSE connection
router.get('/events', function(req, res) {
  console.log('New client connected!');

	res.status(200)
  .set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var onReceive = function(data) {
    sse(res, data);
  };

  events.on('received', onReceive);

  // clean up when connection closes
  res.on('close', function() {
    console.log('Connection closed');
    events.removeListener('received', onReceive);
  });

});

// Send an event to the client
function sse(res, eventName, data) {
  if (data === undefined) {
    data  = eventName;
    eventName = null;
  } else {
    res.write('event: ' + eventName + '\n');
  }
  res.write('data: ' + JSON.stringify(data) + '\n\n');
}

module.exports = router;
