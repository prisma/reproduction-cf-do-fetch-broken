/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// We will create a `DurableObjectId` using the pathname from the Worker request
		// This id refers to a unique instance of our 'MyDurableObject' class above
		let id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName(new URL(request.url).pathname);

		// This stub creates a communication channel with the Durable Object instance
		// The Durable Object constructor will be invoked upon the first call for a given id
		let stub: DurableObjectStub = env.MY_DURABLE_OBJECT.get(id);

		// The following call works
		// const response = await stub.fetch(request);

		// This way to call it does not work
		const response = await stub.fetch(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			// if the following gets copied over it works again
			// cf: request.cf,
		});

		console.log(`Received response from DO in other worker`);
		console.log(`Headers are: ${JSON.stringify(response.headers)}`);
		console.log(`Status is: ${response.status}`);
		console.log(`Body is ${response.body}`);

		return response;
	},
};
