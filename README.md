# web-request-queue

Simple utility to throttle web requests to reduce heavy traffic on your website.

```js
import { webRequest } from '@codejamboree/web-request-queue';

// Same args be be sent to https.request (url, options, callback) or (options, callback)

const options = { method: 'GET' };

const callback = res =>{
  let buffer = new Buffer.alloc(0);
  res.on('data', data => {
    buffer = Buffer.concat([buffer, data]);
  });
  res.on('end', () => {
    console.log(buffer.toString());
  });
};

for(let i = 0; i < 10; i++) {
  webRequest.queue(`https://localhost/api?id=${i}`, options, callback);
}
```
# Post Data

To post form data, you'll need access to the client request, which is retrieved with a callback.

```js
const onRequested = req => {
  req.on('error', (err) => console.error(err));
  req.write("Posted form data");
  req.end();
}
webRequest.queue({
  args: [url, {method: 'POST'}, callback],
  onRequested
});
```
# Canceling Requests

To cancel all requests currently in the queue, call the method

```js
webRequest.cancelQueuedRequests();
```

New requests will not be allowed to be added to the queue. To restore allowing new requests to be queued, call the method to set the expected request count.

```js
webRequest.setTotalRequests(100);
```

# Handle Cancled Requests

If a request in the queue is discarded, the onCancel event will be invoked.

```js
const onCancel = err => {
  console.error(err);
  // I am canceling all requests
}
webRequest.queue({
  args: [url, options, callback],
  onRequested,
  onCancel
});
webRequest.cancelQueuedRequests('I am canceling all requests');
```

# Configuration

## Request Rate

You may set the number of requests allowed within a given period.

```js
// Limit to 10 requests per minute
webRequest.setThrottleMax(10);
webRequest.setThrottlePeriod(60);
```
## Progress Delay

You can set how often the progress log will display statistics. An estimate of time remaining will be calculated and displayed as well based on the average request rate and remaining/queued requests.

```js
// log progress output every 15 seconds
webRequest.setProgressDelay(15);
// Web Requests: 15.015s 2 of 2000 ~ 20h:03m
// Web Requests: 30.403s 5 of 2000 ~ 20h:03m
// Web Requests: 45.075s 7 of 2000 ~ 20h:02m
```

## Total Requests

Rather than relying on queued requests alone, you may set the number of total requests that you expecte to send overall to get a better estimate on the remaing time displayed in the progress logs.

```js
// Set number of requests expected to be made (if known)
webRequest.setTotalRequests(500);
```