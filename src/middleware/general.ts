import { Express } from "express";
import * as express from "express";
import * as cors from "cors";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { startLogger } from "../logging";
import { initialize as initPassport } from "./passport-auth";
require("dotenv").config();

const logger = startLogger(__filename);
const customHeaders = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.setHeader("X-Powered-By", "utopia");
  return next();
};
export default function applyGeneralMiddleware(app: Express) {
  logger.info("starting app middleware...");
  app.use(express.json()); // parse application/json
  app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
  if (process.env.NODE_ENV === "production") {
    app.disable("etag");
    app.use(cors()); // allow cross-origin requests
    app.use(helmet()); // set security headers
    app.use(
      rateLimit({
        windowMs: 20 * 60 * 1000, // 20 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message:
          "Too many requests from this IP, please try again after 20 minutes",
        statusCode: 429,
      })
    ); // limit repeated requests to avoid abuse of the API
    app.use(customHeaders);
  }
  initPassport(app); // set up passport
}
