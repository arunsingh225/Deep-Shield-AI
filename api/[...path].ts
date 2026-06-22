// Vercel Serverless Function — catch-all handler for /api/*
//
// Vercel's file-system routing maps this file to ALL paths under /api/:
//   /api/analyze/document  →  this function
//   /api/analyze/media     →  this function
//   /api/health            →  this function
//   etc.
//
// Express receives req.url as the FULL original path (e.g. "/api/analyze/document"),
// so the routes defined in server/app.ts match directly.

import { app } from '../server/app';

export default app;
