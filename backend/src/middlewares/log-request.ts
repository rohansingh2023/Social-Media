import { Request, Response, NextFunction } from 'express';
import {Logger} from 'log4u';
import { LogParams } from 'log4u/build/logging/model';

const logger = new Logger({ serviceName: 'GraphQL' });

export function logRequest(req: Request, res: Response, next: NextFunction) {
  const logData: LogParams = {
    type: 'INFO',
    message: 'Incoming request',
    sourceURL: req.get('Origin') || req.get('Referer'), // Capture the source URL (Origin or Referer header)
    targetURL: req.originalUrl,  // Capture the target URL (full URL)
    // payload: req.body,           // Log the request payload (body)
    statusCode: res.statusCode,  // Status code to be set after response is finished
  };

  logger.log(logData);

  next();
}
