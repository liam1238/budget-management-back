const supabase = require('../../config/supabase');

// Add a new expense
exports.addExpense = async (req, res) => {
    const { amount, description, date } = req.body;

    if (!amount || !description || !date) {
        return res.status(400).json({ error: "Amount, description, and date are required!" });
    }

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Amount must be a positive number!" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        return res.status(400).json({ error: "Invalid date format!" });
    }

    const { data, error } = await supabase
        .from('expenses')
        .insert([{ amount, description, date }])
        .select();  // Get the inserted row so we can get the id

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    const newExpense = data[0];
    res.status(201).json({
        message: "Expense added successfully",
        data: newExpense,  // Return the new expense with id
    });
};


// Get Expenses with limit + total count 
exports.getExpenses = async (req, res) => {
    const { limit, offset, sortBy } = req.query; // Get limit and offset from query params

    // Ensure limit and offset are integers, fallback to default values if not provided
    const parsedLimit = parseInt(limit, 10) || 5; // Default to 5 if limit is not provided
    const parsedOffset = parseInt(offset, 10) || 0; // Default to 0 if offset is not provided

    try {
        let query = supabase
        .from('expenses')
        .select('*', { count: 'exact' }) // 'exact' will give the total count
        .range(parsedOffset, parsedOffset + parsedLimit - 1); // Adjust range to fetch correct rows
    
        query = (
            sortBy === 'description' ? 
            query.order('description', { ascending: true }) : 
            sortBy === 'amount' ? query = query.order('amount') : query
        );

        const { data: expenses, error: expenseError, count } = await query; 
        if (expenseError) {
            return res.status(400).json({ error: expenseError.message });
        }

        res.status(200).json({ data: expenses, totalCount: count });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getTotalExpense = async (req, res) => {
    const { data, error } = await supabase
      .rpc('get_expenses_sum');  // Call the custom function created in SQL
  
    if (error) {
      console.error('Error fetching total expenses:', error);
      return res.status(500).json({ error: 'Error fetching total expenses' });
    }
    
    return res.json(data);  
};

// Get a specific expense by ID
exports.getExpenseById = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .single(); // Get a single result

    if (error) {
        return res.status(404).json({ error: error.message });
    }

    res.json(data);
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, description, date } = req.body;

    if (!amount || !description || !date) {
        return res.status(400).json({ error: "Amount, description, and date are required!" });
    }

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Amount must be a positive number!" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        return res.status(400).json({ error: "Invalid date format!" });
    }

    const { data, error } = await supabase
        .from('expenses')
        .update({ amount, description, date })
        .eq('id', id); 

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Expense updated successfully", data });
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Expense deleted successfully" });
};
