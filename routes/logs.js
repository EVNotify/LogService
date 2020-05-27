const express = require('express');
const router = express.Router();

const authenticationMiddleware = require('@evnotify/middlewares').authenticationHandler;
const authorizationMiddleware = require('@evnotify/middlewares').authorizationHandler;
const logController = require('../controllers/logs');

router.post('/latest', authorizationMiddleware, authenticationMiddleware, logController.submitToLatestLog);
router.get('/', authorizationMiddleware, authenticationMiddleware, logController.getLogs);
router.get('/:id', authorizationMiddleware, authenticationMiddleware, logController.getLogById);
router.get('/latest', authorizationMiddleware, authenticationMiddleware, logController.getLatestLog);
router.get('/curent', authorizationMiddleware, authenticationMiddleware, logController.getCurrentLog);

module.exports = router;