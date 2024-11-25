import { body, check } from 'express-validator';

export const validateForumCreation = (req, res, next) => {
    return [
        body('name')
            .trim()
            .isAlphanumeric('en-US', {ignore: ' '})
            .withMessage('Please enter a valid forum name. Only alphabets are allowed in forum name.'),
        
        body('purpose')
            .trim()  
            .isLength({ min: 25 })
            .withMessage('Please provide a purpose description of minimum 25 characters'),
        
        body('isPublic')
            .trim()  
            .isBoolean()
            .withMessage('Set the forum visibility to either Public or Private'),
    ];
};