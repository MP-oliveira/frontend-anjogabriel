const { DataTypes } = require('sequelize');
const db = require('../db/db');

// Model for financial transactions (income and expenses)
const Financial = db.define('FinancialTransaction', {
  type: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'BankAccounts',
      key: 'id'
    }
  }
}, {
  tableName: "financial_transactions",
  timestamps: true,
});

// Model for bank accounts
const BankAccount = db.define('BankAccount', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  current_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: "bank_accounts",
  timestamps: true,
});

// Model for daily account balances (historical tracking)
const DailyBalance = db.define('DailyBalance', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'BankAccounts',
      key: 'id'
    }
  }
}, {
  tableName: "daily_balances",
  timestamps: true,
});

// Model for bills to pay
const Bill = db.define('Bill', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM('a vencer', 'pago', 'atrasado'),
    allowNull: false,
    defaultValue: 'a vencer',
  },
  notification_sent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'BankAccounts',
      key: 'id'
    }
  }
}, {
  tableName: "bills",
  timestamps: true,
});

// Define relationships
BankAccount.hasMany(FinancialTransaction, { foreignKey: 'account_id' });
FinancialTransaction.belongsTo(BankAccount, { foreignKey: 'account_id' });

BankAccount.hasMany(DailyBalance, { foreignKey: 'account_id' });
DailyBalance.belongsTo(BankAccount, { foreignKey: 'account_id' });

BankAccount.hasMany(Bill, { foreignKey: 'account_id' });
Bill.belongsTo(BankAccount, { foreignKey: 'account_id' });

module.exports = {
  Financial,
  BankAccount,
  DailyBalance,
  Bill
};