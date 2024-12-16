const supabase = require('../../config/supabase');

exports.addIncome = async (req, res) => {
    const { amount, description, date } = req.body;

    const { data, error } = await supabase
        .from('incomes')
        .insert([{ amount, description, date }])
        .select();  // Get the inserted row so we can get the id

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    const newIncome = data[0];
    res.status(201).json({
        message: "Income added successfully",
        id: newIncome.id, // Return the new income with id
    });
};

// Get Incomes with limit + total count
exports.getIncomes = async (req, res) => {
    const { limit, offset, sortBy } = req.query; // Get limit and offset from query params

    // Ensure limit and offset are integers, fallback to default values if not provided
    const parsedLimit = parseInt(limit, 10) || 5; // Default to 5 if limit is not provided
    const parsedOffset = parseInt(offset, 10) || 0; // Default to 0 if offset is not provided

    try {
        let query = supabase
        .from('incomes')
        .select('*', { count: 'exact' }) // 'exact' will give the total count
        .range(parsedOffset, parsedOffset + parsedLimit - 1); // Adjust range to fetch correct rows

        query = (
            sortBy === 'description' ? 
            query.order('description', { ascending: true }) : 
            sortBy === 'amount' ? query = query.order('amount') : query.order('id')
        );

        const { data: incomes, error: incomeError, count } = await query; 

        if (incomeError) {
            return res.status(400).json({ error: incomeError.message });
        }

        res.status(200).json({ data: incomes, totalCount: count });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getTotalIncome = async (req, res) => {
    const { data, error } = await supabase
      .rpc('get_total_income');  // Call the custom function created in SQL
  
    if (error) {
      return res.status(500).json({ error: 'Error fetching total income' });
    }
  
    return res.json(data);  
};  

exports.getIncomeById = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(404).json({ error: error.message });
    }
    res.json(data);
};

exports.updateIncome = async (req, res) => {
    const { id } = req.params;
    const { amount, description, date } = req.body;

    const { data, error } = await supabase
        .from('incomes')
        .update({ amount, description, date })
        .eq('id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json({ message: "Income updated successfully", data });
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json({ message: "Income deleted successfully" });
};
