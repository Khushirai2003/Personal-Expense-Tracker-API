// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { expenses, categories } = require('./data'); // Import data.js

// Initialize the app
const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// POST /expenses - Add a new expense
app.post('/expenses', (req, res) => {
  const { category, amount, date } = req.body;

  // Validate the category
  if (!categories.includes(category)) {
    return res.status(400).json({ status: 'error', error: 'Invalid category' });
  }

  // Validate the amount
  if (amount <= 0) {
    return res.status(400).json({ status: 'error', error: 'Amount must be greater than 0' });
  }

  // Create a new expense object
  const expense = {
    id: Date.now(), // Use the current timestamp as a unique ID
    category,
    amount,
    date: new Date(date), // Ensure the date is in a valid format
  };

  // Add the new expense to the expenses array
  expenses.push(expense);

  // Send back the created expense
  res.json({ status: 'success', data: expense });
});

// GET /expenses - Get all expenses
app.get('/expenses/:id', (req, res) => {
  res.json({ status: 'success', data: expenses, error: null });
});

// DELETE /expenses/:id - Delete an expense by ID
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;

  // Find the index of the expense by ID
  const expenseIndex = expenses.findIndex(exp => exp.id === parseInt(id));

  // If the expense is not found, return an error
  if (expenseIndex === -1) {
    return res.status(404).json({ status: 'error', data: null, error: 'Expense not found' });
  }

  // Remove the expense from the array
  expenses.splice(expenseIndex, 1);

  // Return success response
  res.json({ status: 'success', data: { id }, error: null });
});

// Simple error handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ status: 'error', error: 'Route not found' });
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

  