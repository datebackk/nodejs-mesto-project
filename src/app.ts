import express,
{
  Response,
  NextFunction
} from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { AuthRequest } from './types/auth-request';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/mestodb');

app.use((req: AuthRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '691cd96052c9d8cc1716097d'
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter)

app.listen(3000)