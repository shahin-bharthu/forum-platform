import { body } from 'express-validator';

export const validateUpdateProfile = (req, res, next) => {
    return [
        body('firstname')
            .trim()
            .isAlpha(),
        body('lastname')
            .trim()
            .isAlpha(),
        body('country')
            .isAlpha(),
        body('gender')
            .isIn(['male', 'female', 'other','pnts'])
            .withMessage('Gender must be one of the following: male, female, other, prefer not to say')
    ];
};

// export const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     next();
// };