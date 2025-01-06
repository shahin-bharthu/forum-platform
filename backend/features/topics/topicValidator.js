import { body, check } from 'express-validator';

export const validateTopicCreation = (req, res, next) => {
    return [
        body('title')
            .trim()
            .isLength({min: 10, max: 200})
            .withMessage('Please enter a valid post title of minimum 10 characters.')
            .isString()
            .withMessage('Please enter a valid post title.'),
        
        body('content')
            .trim()  
            .isLength({ min: 50})
            .withMessage('Please provide a description of minimum 50 characters'),
        
        body('forum_id')
            .trim()
            .notEmpty() 
            .withMessage('An error occured'),
    ];
};

export const validateTopicUpdate = (req, res, next) => {
    return [
        // body('title')
        //     .trim()
        //     .isLength({min: 10, max: 200})
        //     .withMessage('Please enter a valid post title of minimum 10 characters.')
        //     .isAlphanumeric('en-US', {ignore: ' '})
        //     .withMessage('Please enter a valid post title.'),
        
        body('content')
            .trim()  
            .isLength({ min: 50})
            .withMessage('Please provide a description of minimum 50 characters'),
    ];
};