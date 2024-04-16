# DO.fetch broken

We noticed a regression in accessing a Durable Object in another Worker Project when runnig locally after upgrading to 3.46.0. After this upgrade all calls to the Durable Object are failing with opaque errors. All responses result in a 500 without useful response bodies or headers.

## Reproduction Steps

This repository is an atttempt at a minimal reproduction. It can be reproduced as following:

1. Run `npm run start` in `my-counter-worker`
2. Run `npm run start` in `calling-counter-worker`
3. Run `curl localhost:9001/foo`. This will trigger the opaque 500 response in the calling worker. The request will not reach the DO.

## Known Workaround

The problem lies in how the `fetch` method of the DO stub gets called. The following does not work:

```
const response = await stub.fetch(request.url, {
	method: request.method,
	headers: request.headers,
	body: request.body,
});
```

If the `cf` property is added it starts to work again:

```
const response = await stub.fetch(request.url, {
	method: request.method,
	headers: request.headers,
	body: request.body,
	// if the following gets copied over it works again
	cf: request.cf
});
```
