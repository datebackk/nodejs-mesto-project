import { z } from 'zod';
import { urlRegex } from '../constants/url-regexp';

export const postCardSchema = z.object({
    name: z.string().min(2).max(30).optional(),
    link: z.string().regex(urlRegex, 'Некорректный URL').optional(),
})

export const cardIdSchema = z.object({
    params: z.object({
        cardId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Некорректный формат cardId'),
    })
})