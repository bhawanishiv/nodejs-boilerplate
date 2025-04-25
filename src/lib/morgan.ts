import morgan, { StreamOptions } from 'morgan';
import { Request, Response } from 'express';
import { ENVIRONMENT } from './env';
import logger from './logger';

morgan.token(
  'message',
  (req: Request, res: Response) => res.locals.errorMessage || '',
);

const getIpFormat = (): string =>
  ENVIRONMENT === 'production' ? ':remote-addr - ' : '';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: {
    write: (message: string) => logger.info(message.trim()),
  } as StreamOptions,
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: {
    write: (message: string) => logger.error(message.trim()),
  } as StreamOptions,
});

export default {
  successHandler,
  errorHandler,
};
