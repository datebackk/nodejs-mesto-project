import {
  Request,
  Response,
  NextFunction
} from 'express';
import jwt,
{
  JwtPayload
} from 'jsonwebtoken';
import { HttpStatus } from '../enums/http-status';

const { JWT_SECRET = 'secret' } = process.env

interface SessionRequest extends Request {
    user?: string | JwtPayload;
}

const handleAuthError = (res: Response) => {
    res
    .status(HttpStatus.Unauthorized)
    .send({ message: 'Отсутствует авторизация' });
};

const extractBearerToken = (header: string) => {
  return header.replace('Bearer ', '');
};

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
      return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
      payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
      return handleAuthError(res);
  }

  req.user = payload;

  next();
};