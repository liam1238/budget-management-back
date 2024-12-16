const express = require('express');
const router = express.Router();
const incomesRoutes = require('./incomes');
const expensesRoutes = require('./expenses');

router.use('/incomes', incomesRoutes);
router.use('/expenses', expensesRoutes);

module.exports = router;
