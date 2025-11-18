import { Router } from 'express';
import { 
    getUsers, 
    getUserId, 
    postUser, 
    patchUser, 
    patchUserAvatar 
} from '../controllers/users';

const router = Router();

router.get('/', getUsers)
router.get('/:userId', getUserId)
router.post('/', postUser)
router.patch('/me', patchUser)
router.patch('/me/avatar', patchUserAvatar)

export default router;