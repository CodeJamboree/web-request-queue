# web-request-queue

Simple utility to throttle web requests to reduce heavy traffic on your website. 

# Queing

You can call queue with the same arguments as https.request. However, it returns a promise that eventually resolves into a request, rather than the request itself.

```js
import { webRequest } from '@codejamboree/web-request-queue';

const options = { method: 'GET' };

const callback = res => {
  let buffer = new Buffer.alloc(0);
  res.on('data', data => {
    buffer = Buffer.concat([buffer, data]);
  });
  res.on('error', err => {
    console.error(err);
  });
  res.on('end', () => {
    console.log(buffer.toString());
  });
};

// same args as https.request
webRequest.queue(`https://localhost/api?id=${i}`, options, callback)
  .then(req => {
    req.on('error', err => console.error(err));
    req.end();
  })
  .catch(err => {
    console.error(err);
  });
```
# Callbacks

If you prefer not to work with promises, you can also wrap the arguments and add a callback to process the request once it is retrieved.

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
  // Output: I am canceling all requests
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
webRequest.setRequestsPerPeriod(10);
webRequest.setSecondsPerPeriod(60);
```
## Progress

You can set display a progress report when you have a large number of reqeusts in the queue. It will attempt to estimate the time remaining based on the number of requests in the queue, or the total number of expected requests that you had set. By default, progress reports are disabled.

```js
// log progress output every 15 seconds
webRequest.setProgressDelay(15);
// Web Requests: 15.015s 2 of 2000 ~ 20h:03m
// Web Requests: 30.403s 5 of 2000 ~ 20h:03m
// Web Requests: 45.075s 7 of 2000 ~ 20h:02m

// disable progress output
webRequest.setProgressDelay(Infinity);
```

## Total Requests

Rather than relying on queued requests alone, you may set the number of total requests that you expecte to send overall to get a better estimate on the remaing time displayed in the progress logs.

```js
// Set number of requests expected to be made (if known)
webRequest.setTotalRequests(500);
```