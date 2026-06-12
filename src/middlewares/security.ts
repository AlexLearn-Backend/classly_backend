import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/env.js";
import aj from "../config/arcjet.js";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";
import type { RateLimitRole } from "../type.js";


export default async function securityMiddleware (
  req: Request, 
  res: Response,
  next: NextFunction
) {
  if (NODE_ENV === 'test') return next();

  try {
    const role: RateLimitRole = req.user?.role ?? 'guest';

    let limit: number;
    let message: string;

    switch (role) {
      case 'admin':
        limit = 20
        message = "Administrator request limit exceeded (20 per minute)"
        break;
    
      case "teacher":
      case 'student':
        limit = 10
        message = "User request limit exceeded (10 per minute)"
        break;
      
      default:
        limit = 5
        message = "Guest request limit exceeded (5 per minute). Please signup for higher limits."
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: '1m',
        max: limit
      })
    )

    const clientIp = req.socket.remoteAddress ?? req.ip;
    
    if (!clientIp) {
      console.warn('Security middleware: Request without valid IP address');
      return res.status(403).json({
        error: "Forbidden",
        message: "Unable to identify client address."
      });
    }
    

    const arcjetRequest: ArcjetNodeRequest = {
      headers: req.headers,
      method: req.method,
      url: req.originalUrl ?? req.url,
      socket: {
        remoteAddress: clientIp
      }
    }

    const decision = await client.protect(arcjetRequest);

    if (decision.isDenied() && decision.reason.isBot()) {
      return res.status(403).json({
        error: "Forbidden!",
        message: "Automated requests are not allowed."
      })
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      return res.status(403).json({
        error: "Forbidden!",
        message: "Request blocked by security policy."
      })
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      return res.status(429).json({
        error: "Too many request!",
        message
      })
    }

    if (decision.isDenied()) {
      return res.status(403).json({
        error: "Forbidden!",
        message: "Request denied by security policy."
      })
    }

    next()

  }
  catch (e) {
    console.error(`Arcjet Middleware Error: ${e}`);
    res.status(500).json({
      error: "Internal server error!",
      message: "Something went wrong with security middleware!"
    })
  }
}