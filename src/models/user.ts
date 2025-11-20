import {
  Model,
  model,
  Schema,
  Document
} from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

type User = {
    name: string;
    about: string;
    avatar: string;
    email: string;
    password: string;
}

interface UserModel extends Model<User> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, User>>
}

const userSchema = new Schema<User>({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Жак-Ив Кусто',
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 200,
        default: 'Исследователь',
    },
    avatar: {
        type: String,
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
          validator: (value: string) => validator.isEmail(value),
          message: 'Некорректная почта',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Минимальная длина пароля - 8 символов'],
        select: false
    },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').then((user: User) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user;
    });
  });
});

export default model<User, UserModel>('User', userSchema);