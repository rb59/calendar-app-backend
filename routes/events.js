/* 
    Events routes
    path = host/api/events
*/
const { Router } = require('express');
// Validation
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const { isDate } = require('../helpers/isDate');
// Controllers
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/events');

const router = Router();
router.use(jwtValidator);

router.get('/', getEvents);
router.post(
    '/',
    [
        check('title', 'Title field is required').not().isEmpty(),
        check('start', 'Initial date is required').custom(isDate),
        check('end', 'Final date is required').custom(isDate),
        fieldsValidator,
    ],
    createEvent
    );
router.put(
    '/:id', 
    [
        check('title', 'Title field is required').not().isEmpty(),
        check('start', 'Initial date is required').custom(isDate),
        check('end', 'Final date is required').custom(isDate),
        fieldsValidator,
    ],
    updateEvent
);
router.delete('/:id', deleteEvent);

module.exports = router;
