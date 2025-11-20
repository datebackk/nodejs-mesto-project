import {
  NextFunction,
  Request,
  Response
} from 'express';
import User from '../models/user'
import { AuthRequest } from '../types/auth-request';
import { HttpStatus } from '../enums/http-status';
import { ErrorMessage } from '../enums/error-message';
import { MongoError } from '../enums/mongo-error';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'secret' } = process.env

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email
  } = req.body;

  return bcrypt.hash(req.body.password, 10)
      .then((hash: string) => User.create({
          name, about, avatar, email, password: hash
      }))
      .then(user => {
          const { password, ...userResponse } = user.toObject();

          res.status(HttpStatus.Created).send({ data: userResponse })
      })
      .catch((err) => {
          if (err.name === MongoError.ValidationError) {
              return res.status(HttpStatus.BadRequest).send({
                  message: ErrorMessage.BadRequest,
              });
          }

          if (err.code === 11000) {
              return res.status(409).send({ message: 'Пользователь с таким email уже существует' });
          }

          next(err);
      });
}

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(user => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000 * 24 * 7,
        })
        .send({ token });
    })
    .catch(next);
};

export const getUserMe = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  return User.findById(userId)
      .then((user) => {
          if (!user) {
              return res.status(HttpStatus.NotFound).send({ message: ErrorMessage.NotFound });
          }

          res.status(HttpStatus.Ok).send({ data: user })
      })
      .catch((err) => {
          if (err.name === MongoError.CastError) {
              return res.status(HttpStatus.BadRequest).send({ message: ErrorMessage.BadRequest })
          }

          next(err);
      })
}

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    return User.find({})
        .then(users => res.status(HttpStatus.Ok).send({ data: users }))
        .catch(next)
}

export const getUserId = (req: Request, res: Response, next: NextFunction) => {
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

            next(err);
        })
}

export const patchUser = (req: AuthRequest, res: Response, next: NextFunction) => {
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

      next(err);
    });
}

export const postUser = (req: Request, res: Response, next: NextFunction) => {
    const { name, about, avatar } = req.body;

    return User.create({ name, about, avatar })
        .then(user => res.status(HttpStatus.Created).send({ data: user }))
        .catch(err => {
            if (err.name === MongoError.ValidationError) {
                return res.status(HttpStatus.BadRequest).send({
                    message: ErrorMessage.BadRequest,
                });
            }

            next(err);
        });
}

export const patchUserAvatar = (req: AuthRequest, res: Response, next: NextFunction) => {
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

            next(err);
        });
}