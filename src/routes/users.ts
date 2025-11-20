import { Router } from 'express';
import {
    getUsers,
    getUserId,
    patchUser,
    getUserMe,
    patchUserAvatar
} from '../controllers/users';
import validateRequest from '../middlewares/validate';
import { patchUserAvatarSchema, patchUserSchema } from '../validators/user';

const router = Router();

router.get('/', getUsers)
router.get('/me', getUserMe)
router.get('/:userId', getUserId)
router.patch('/me', validateRequest(patchUserSchema), patchUser)
router.patch('/me/avatar', validateRequest(patchUserAvatarSchema), patchUserAvatar)

export default router;