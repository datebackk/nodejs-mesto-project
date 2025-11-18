import {
    Request,
    Response
} from 'express';
import User from '../models/user'
import { AuthRequest } from '../types/auth-request';
import { HttpStatus } from '../enums/http-status';
import { ErrorMessage } from '../enums/error-message';
import { MongoError } from '../enums/mongo-error';

export const getUsers = (req: Request, res: Response) => {
    return User.find({})
        .then(users => res.status(HttpStatus.Ok).send({ data: users }))
        .catch(() => res.status(HttpStatus.InternalServerError)
          .send({ message: ErrorMessage.InternalServerError }))
}

export const getUserId = (req: Request, res: Response) => {
    const { userId } = req.params;

    return User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(HttpStatus.NotFound).send({ message: ErrorMessage.NotFound });
            }

            res.status(HttpStatus.Ok).send({ data: user })
        })
        .catch(err => {
            if (err.name === MongoError.CastError) {
                return res.status(HttpStatus.BadRequest).send({ message: ErrorMessage.BadRequest })
            }

            res.status(HttpStatus.InternalServerError)
              .send({ message: ErrorMessage.InternalServerError })
        })
}

export const patchUser = (req: AuthRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then(user => {
      if (!user) {
        return res.status(HttpStatus.NotFound).send({ message: ErrorMessage.NotFound });
      }

      res.status(HttpStatus.Ok).send({ data: user })
    })
    .catch(err => {
      if (err.name === MongoError.ValidationError) {
        return res.status(HttpStatus.BadRequest).send({
          message: ErrorMessage.BadRequest,
        });
      }

      res.status(HttpStatus.InternalServerError).send({ message: ErrorMessage.InternalServerError })
    });
}

export const postUser = (req: Request, res: Response) => {
    const { name, about, avatar } = req.body;

    return User.create({ name, about, avatar })
        .then(user => res.status(HttpStatus.Created).send({ data: user }))
        .catch(err => {
            if (err.name === MongoError.ValidationError) {
                return res.status(HttpStatus.BadRequest).send({
                    message: ErrorMessage.BadRequest,
                });
            }

            res.status(HttpStatus.InternalServerError)
              .send({ message: ErrorMessage.InternalServerError })
        });
}

export const patchUserAvatar = (req: AuthRequest, res: Response) => {
    const { avatar } = req.body;
    const userId = req.user?._id;

    return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
        .then(user => {
            if (!user) {
                return res.status(HttpStatus.NotFound).send({ message: ErrorMessage.NotFound });
            }

            res.status(HttpStatus.Ok).send({ data: user })
        })
        .catch(err => {
            if (err.name === MongoError.ValidationError) {
                return res.status(HttpStatus.BadRequest).send({
                    message: ErrorMessage.BadRequest,
                });
            }

            res.status(HttpStatus.InternalServerError)
              .send({ message: HttpStatus.InternalServerError })
        });
}