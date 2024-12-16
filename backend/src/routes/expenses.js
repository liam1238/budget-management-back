const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, getTotalExpense, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');

router.post('', addExpense);
router.get('', getExpenses);
router.get('/total', getTotalExpense);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
