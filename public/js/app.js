var sse = new ServerSentEvent('events');

sse.on('message', function(message) {
    console.log('message from server:');

    var data = JSON.parse(message);
    console.log(data);
});
