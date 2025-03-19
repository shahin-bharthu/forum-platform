import { body, check } from 'express-validator';

export const validateForumCreation = (req, res, next) => {        
    return [
        body('name')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Please enter a valid forum name with minimum 3 characters')
            .isAlphanumeric('en-US', {ignore: ' '})
            .withMessage('Only alphabets are allowed in forum name'),
        
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