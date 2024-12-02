import { body, check } from 'express-validator';

export const validateTopicCreation = (req, res, next) => {
    return [
        body('content')
            .trim()
            .notEmpty()
            .withMessage('Comment content cannot be empty.'),

        body('topic_id')
            .trim()
            .notEmpty()
            .withMessage('Topic ID cannot be empty.')
    ];
};