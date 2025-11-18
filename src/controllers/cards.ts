import {
    Request,
    Response
} from 'express';
import Card from '../models/card'
import { AuthRequest } from '../types/auth-request';
import { HttpStatus } from '../enums/http-status';
import { ErrorMessage } from '../enums/error-message';
import { MongoError } from '../enums/mongo-error';

export const getCards = (req: Request, res: Response) => {
    return Card.find({})
        .then(cards => res.status(HttpStatus.Ok).send({ data: cards }))
        .catch(() => res.status(HttpStatus.InternalServerError)
            .send({ message: ErrorMessage.InternalServerError }))
}

export const postCard = (req: AuthRequest, res: Response) => {
    const { name, link } = req.body;
    const owner = req.user?._id;

    return Card.create({ name, link, owner })
        .then(card => res.status(HttpStatus.Created).send({ data: card }))
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

export const putCardsLikes = (req: AuthRequest, res: Response) => {
    const { cardId } = req.params;
    const userId = req.user?._id;

    return Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: userId } },
        { new: true },
    )
        .then(card => {
            if (!card) {
                return res.status(HttpStatus.NotFound).send({ message: ErrorMessage.NotFound });
            }
            res.status(HttpStatus.Ok).send({ data: card })
        })
        .catch(err => {
            if (err.name === MongoError.CastError || err.name === MongoError.ValidationError) {
                return res.status(HttpStatus.BadRequest).send({ message: ErrorMessage.BadRequest })
            }

            res.status(HttpStatus.InternalServerError)
              .send({ message: ErrorMessage.InternalServerError })
        })
}

export const deleteCard = (req: AuthRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  return Card.findByIdAndDelete(cardId)
    .then(card => {
      if (!card) {
        return res.status(HttpStatus.NotFound).send({ message: ErrorMessage.NotFound });
      }

      if ((String(card.owner) !== userId)) {
        return res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      }

      res.status(HttpStatus.Ok).send({ message: 'Карточка удалена' })
    })
    .catch(err => {
      if (err.name === MongoError.CastError) {
        return res.status(HttpStatus.BadRequest).send({ message: ErrorMessage.BadRequest })
      }
      res.status(HttpStatus.InternalServerError).send({ message: ErrorMessage.InternalServerError })
    })
}

export const deleteCardsLikes = (req: AuthRequest, res: Response) => {
    const { cardId } = req.params;
    const userId = req.user?._id;

    return Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: userId } },
        { new: true },
    )
        .then(card => {
            if (!card) {
                return res.status(HttpStatus.NotFound).send({ message: ErrorMessage.NotFound });
            }

            res.status(HttpStatus.Ok).send({ message: 'Лайк удалён' })
        })
        .catch(err => {
            if (err.name === MongoError.CastError || err.name === MongoError.ValidationError) {
                return res.status(HttpStatus.BadRequest).send({ message: ErrorMessage.BadRequest })
            }

            res.status(HttpStatus.InternalServerError)
              .send({ message: ErrorMessage.InternalServerError })
        })
}