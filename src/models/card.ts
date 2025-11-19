import {
    model,
    Schema,
    Types
} from 'mongoose';
import { urlRegex } from '../constants/url-regexp';

type Card = {
    name: string;
    link: string;
    owner: Types.ObjectId;
    likes: Types.ObjectId[];
    CreatedAt: Date;
}

const cardSchema = new Schema<Card>({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    link: {
        type: String,
        required: true,
        validate: {
          validator: (link: string) => urlRegex.test(link),
          message: 'Некорректный URL',
        },
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: [],
    }],
    CreatedAt: {
        type: Date,
        default: Date.now
    }

}, { versionKey: false })

export default model<Card>('Card', cardSchema);