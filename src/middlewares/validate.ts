import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { HttpStatus } from '../enums/http-status';
import { ErrorMessage } from '../enums/error-message';

const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(HttpStatus.BadRequest).json({
        statusCode: HttpStatus.BadRequest,
        error: ErrorMessage.BadRequest,
        message: result.error.errors,
      });
    }

    next();
  };
};

export default validateRequest;