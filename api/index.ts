import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { createApp } from '../server/app';

let handlerPromise: Promise<any> | null = null;

async function getHandler() {
	if (!handlerPromise) {
		const { app } = await createApp();
		handlerPromise = Promise.resolve(serverless(app));
	}
	return handlerPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const h = await getHandler();
	return h(req, res);
}