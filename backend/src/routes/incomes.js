const express = require('express');
const router = express.Router();
const { addIncome, getIncomes, getTotalIncome, getIncomeById, updateIncome, deleteIncome } = require('../controllers/incomeController');

router.post('', addIncome);
router.get('', getIncomes);
router.get('/total', getTotalIncome);
router.get('/:id', getIncomeById);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

module.exports = router;