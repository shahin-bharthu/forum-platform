import { body } from 'express-validator';

export const validateUpdateProfile = (req, res, next) => {
    return [
        body('firstname')
            .trim()
            .isAlpha()
            .isLength({min: 2}),
        body('lastname')
            .trim()
            .isAlpha()
            .isLength({min: 2}),
        body('dob')
            .isDate()
            .withMessage('Invalid date of birth'),
        body('country')
            .isAlpha()
            .isLength({min: 4}),
        body('gender')
            .isIn(['male', 'female', 'other'])
            .withMessage('Gender must be one of the following: male, female, other')
    ];
};

// export const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     next();
// };
