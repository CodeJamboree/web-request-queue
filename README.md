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
webRequest.queueSync({
  args: [url, {method: 'POST'}, callback],
  onRequested
});
```
# Canceling Requests

To cancel all requests currently in the queue, call the method

```js
const onCancel = err => console.log(err);
webRequest.queueSync({args: ["https://localhost"], onCancel});
webRequest.cancel("I have my reasons");
// Output: I have my reasons
```

# Configuration

Configuration options can be passed to adjust the behavior. Each key is optional.

```js
webRequest.configure({
  requestsPerPeriod: 10,
  secondsPerPeriod: 60,
  pause: false
});
```

- `requestsPerPeriod`: The total number of requests permitted per period.
- `secondsPerPeriod`: The number of seconds within a period.
- `pause`: Start/Stop the requests without flushing the queue

## Request Rate

You may set the number of requests allowed within a given period.

```js
// Limit to 10 requests per minute
webRequest.configure({ reqeustsPerPeriod: 10, secondsPerPeriod: 60 });
```
## Info

You can set request information about the current state of the queue.

```js
console.log(webRequest.info());
```

It will provide an object similar to the following.

```json
{
  "requested": 32,
  "queued": 12000,
  "firstAt": "2024-08-30T23:51:22.818Z",
  "paused": false
}
```
With it, you can work out the progress of a batch of requests.
```js

const label = 'Queue';
console.time(label);

let interval = setInterval(() => {
  const { requested, queued } = webRequest.info();
  console.timeLog(label, 'Requested', requested, 'of', requested + queued);
}, 1000);

const queueId = id => webRequest.queue(`https://localhost/${id}`);

Promise.all([1,2,3].map(queueId))
    .finally(() => {
      clearInterval(interval);
      console.timeEnd(label);
    });
// Queue: 1.002s Requested 1 of 3
// Queue: 2.004s Requested 1 of 3
// Queue: 3.005s Requested 2 of 3
// Queue: 4.007s Requested 2 of 3
```