import { z } from 'zod';
import { urlRegex } from '../constants/url-regexp';

export const createUserSchema = z.object({
    name: z.string().min(2).max(30).optional(),
    about: z.string().min(2).max(200).optional(),
    avatar: z.string().regex(urlRegex, 'Некорректный URL').optional(),
    email: z.string().email({ message: 'Некорректный email' }),
    password: z.string().min(8, 'Минимальная длина пароля - 8 символов'),
});

export const loginUserSchema = z.object({
    email: z.string().email({ message: 'Некорректный email' }),
    password: z.string().min(8, 'Минимальная длина пароля - 8 символов'),
});

export const patchUserSchema = z.object({
    name: z.string().min(2).max(30).optional(),
    about: z.string().min(2).max(200).optional(),
});

export const patchUserAvatarSchema = z.object({
    avatar: z.string().regex(urlRegex, 'Некорректный URL').optional(),
});

