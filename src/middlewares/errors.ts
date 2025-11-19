import {
    Request,
    Response,
} from 'express';
import { HttpStatus } from '../enums/http-status';

type Error = {
    statusCode?: number,
    message?: string
}

const errorHandler = (err: Error, req: Request, res: Response) => {
    const { statusCode = HttpStatus.InternalServerError, message } = err;

    res.status(statusCode).send({
        message: statusCode === HttpStatus.InternalServerError
          ? 'Произошла ошибка'
          : message
      });
};

export default errorHandler;