import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { globalLimiter } from "./middleware/rate-limit.middleware.js";
import { requestId, logRequest } from "./middleware/logging.middleware.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { registerRoutes } from "./routes.js";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
const allowedFrontendOrigins = env.FRONTEND_ORIGIN.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

// Own Vercel origins for this project: the production alias
// (simienethiopatours.vercel.app, with or without www) and preview
// deployments from the same Vercel team
// (simienethiopatours-<hash>-pr3r1chh-1328s-projects.vercel.app).
// Scoped to the team slug so arbitrary *.vercel.app sites stay blocked.
const ownVercelOriginPattern =
	/^https:\/\/(?:www\.)?simienethiopatours(?:-[a-z0-9]+)*-pr3r1chh-1328s-projects\.vercel\.app$/;

app.use(
	cors({
		origin(origin, callback) {
			if (
				!origin ||
				allowedFrontendOrigins.includes(origin) ||
				ownVercelOriginPattern.test(origin)
			) {
				return callback(null, true);
			}
			return callback(null, false);
		},
		credentials: true,
	}),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestId);
app.use(logRequest);
app.use(globalLimiter);
app.use(
	"/assets",
	express.static(path.resolve(process.cwd(), env.UPLOAD_ROOT, "assets")),
);

app.use("/health", healthRouter);
registerRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);
