const express = require('express');
const router = express.Router();

const authenticationMiddleware = require('@evnotify/middlewares').authenticationHandler;
const authorizationMiddleware = require('@evnotify/middlewares').authorizationHandler;
const logController = require('../controllers/logs');

router.post('/:akey/latest', authorizationMiddleware, authenticationMiddleware, logController.submitToLatestLog);
router.get('/:akey', authorizationMiddleware, authenticationMiddleware, logController.getLogs);
router.get('/:akey/latest', authorizationMiddleware, authenticationMiddleware, logController.getLatestLog);
router.get('/:akey/current', authorizationMiddleware, authenticationMiddleware, logController.getCurrentLog);
router.get('/:akey/:id', authorizationMiddleware, authenticationMiddleware, logController.getLogByID);

module.exports = router;