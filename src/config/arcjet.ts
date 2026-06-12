import arcjet, { shield, detectBot, slidingWindow} from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV, ARCJET_ENV } from "./env.js";


if (!ARCJET_KEY && NODE_ENV !== "test") {
  throw new Error("ARCJET_KEY is not defined in environment variables");
}


const aj = arcjet({
  key: ARCJET_KEY!,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
      ],
    }),
    // Create a rate limiting rule with a sliding window algorithm
    // Allow 5 independent request on 2s interval
    slidingWindow({
      mode: "LIVE",
      interval: '2s',
      max: 5
    })   
  ],
});

export default aj;