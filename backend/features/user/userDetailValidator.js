import { body, check, validationResult } from 'express-validator';

export const validateSignup = (req, res, next) => {
    return [
        body('firstname')
            .trim()
            .isLength({min: 2}),
        body('lastname')
            .trim()
            .isLength({min: 2}),
        body('dob')
            .isDate()
            .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
        // body('confirmPassword', 'Passwords do not match!')
        //     .custom((value, { req }) => {
        //         if (value !== req.body.password) {
        //             throw new Error('Passwords do not match!');
        //         }
        //         return true;
        //     })
        //     .trim()
    ];
};

// export const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     next();
// };
