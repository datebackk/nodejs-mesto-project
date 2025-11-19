import { Router } from 'express';
import {
    getCards,
    postCard,
    deleteCard,
    putCardsLikes,
    deleteCardsLikes
} from '../controllers/cards';
import { cardIdSchema, postCardSchema } from '../validators/card';
import validateRequest from '../middlewares/validate';

const router = Router();

router.get('/', getCards)
router.post('/', validateRequest(postCardSchema), postCard)
router.delete('/:cardId', validateRequest(cardIdSchema), deleteCard)
router.put('/:cardId/likes', validateRequest(cardIdSchema), putCardsLikes)
router.delete('/:cardId/likes', validateRequest(cardIdSchema), deleteCardsLikes)

export default router;