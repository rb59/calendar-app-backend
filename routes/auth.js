/* 
    Auth routes
    path = host/api/auth 
*/
const { Router } = require('express');
// Validation
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
// Controllers
const { createUser, loginUser, renewToken } = require('../controllers/auth');

const router = Router();

router.post(
    '/new',
    [
        check('name', 'Name field is required').not().isEmpty(),
        check('email', 'Email field is required').isEmail(),
        check('password', 'Password must be at least 6 chars long').isLength({
            min: 6,
        }),
        fieldsValidator,
    ],
    createUser
);

router.post(
    '/',
    [
        check('email', 'Email field is required').isEmail(),
        check('password', 'Password must be at least 6 chars long').isLength({
            min: 6,
        }),
        fieldsValidator,
    ],
    loginUser
);

router.get('/renew', [jwtValidator], renewToken);

module.exports = router;
