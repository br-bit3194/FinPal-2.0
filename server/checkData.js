const mongoose = require('mongoose');
const connectDb = require('./db_config/db_config');
const User = require('./Models/userModel');
const Income = require('./Models/incomeModel');
const Expense = require('./Models/expenseModel');
const Finance = require('./Models/financeModel');
require('dotenv').config();
require('colors');

const checkData = async () => {
    try {
        await connectDb();
        console.log('Connected to DB');

        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            const incomeCount = await Income.countDocuments({ user: user._id });
            const expenseCount = await Expense.countDocuments({ user: user._id });
            const financeCount = await Finance.countDocuments({ user: user._id });

            console.log(`User: ${user.email} (${user._id})`);
            console.log(`  Incomes: ${incomeCount}`);
            console.log(`  Expenses: ${expenseCount}`);
            console.log(`  Transactions: ${financeCount}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
