import { body, check } from 'express-validator';

export const validateSignup = (req, res, next) => {
    return [
        check('email')
            .notEmpty()
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),
        
        body('username')
            .trim()  
            .notEmpty()
            .isLength({ min: 3 })
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Username must contain only letters, numbers, and underscores.'),
        
        body('password')
            .trim()  
            .notEmpty()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
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


export const validateLogin = (req, res, next) => {
    return [
        check('email')
            .notEmpty()
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),
        
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required to sign in')
    ];
};

// export const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     next();
// };
