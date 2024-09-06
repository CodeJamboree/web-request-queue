# web-request-queue

Simple utility to throttle web requests to reduce heavy traffic on your website.

# Queing

You can call queue with the same arguments as https.request. However, it returns a promise that eventually resolves into a request, rather than the request itself.

```js
import { webRequest } from '@codejamboree/web-request-queue';

const callback = res => {
  let buffers = [];
  res.on('data', data => buffers.push(data));
  res.on('error', err => console.error(err));
  res.on('end', () => {
    console.log(Buffer.concat(buffers).toString());
  });
};

// same args as https.request
webRequest.queue(`https://localhost/api?id=${i}`, { method: 'GET' }, callback)
  .then(req => {
    req.on('error', err => console.error(err));
    req.end();
  })
  .catch(err => console.error(err));
```

# Callbacks

If you prefer to work with callbacks, you can pass them as an object, where the original arguments are passed as the `args` key.

```js
const onRequested = req => {
  req.on('error', (err) => console.error(err));
  req.write("Posted form data");
  req.end();
}
webRequest.queueWithCallbacks({
  args: [url, {method: 'POST'}, callback],
  onRequested
});
```
# Canceling Requests

To cancel all requests currently in the queue, call the method

```js
const onCancel = err => console.log(err);
webRequest.queueWithCallbacks({args: ["https://localhost"], onCancel});
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
- `pause`: Start/Stop the requests without clearing/canceling the queue

## Request Rate

You may set the number of requests allowed within a given period.

```js
// Limit to 10 requests per minute
webRequest.configure({ reqeustsPerPeriod: 10, secondsPerPeriod: 60 });
```
## Info

You can request information about the current state of the queue.

```js
console.log(webRequest.info());
// {
//  "requested": 32,
//  "queued": 12000,
//  "firstAt": 2024-08-30T23:51:22.818Z,
//  "paused": false
// }
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

# Helper Functions

A few helper functions are included to simplify working with websites.

## Saving Files
```js
const temp = path.join(os.tmpdir(), `temp-${Date.now()}.html`);
webRequest.toFile(temp, "https://localhost");
```
## Getting a string
```js
const temp = path.join(os.tmpdir(), `temp-${Date.now()}.html`);
const html = await webRequest.asString(temp, "https://localhost");
console.log(html);
```
## Send to a stream
```js
webRequest.toStream(process.stdout, "https://localhost").then(stream => stream.end());
```
## Parse JSON responses
```js
const url = "https://localhost/api/user/id";

const user = webRequest.parseJson(url);
console.log('Date', user.date, typeof user.date);
// Output: Date 2024-09-05T00:00:00Z string

const reviver = (key, value) => {
  return key === 'date' ? new Date(value) : value;
}

const user = webRequest.parseJsonWithRevivor(reviver, url);
console.log('Date', user.date, typeof user.date);
// Output: Date 2024-09-05T00:00:00Z object

// Generic Types supported
const user = webRequest.parseJson<User>(url);
const user = webRequest.parseJsonWithRevivor<User>(reviver, url);
```