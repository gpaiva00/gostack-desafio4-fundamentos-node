import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const initIncome = 0;
    const initOutcome = 0;

    const income = this.transactions.reduce((acc, curr) => {
      if (curr.type === 'income') return acc + curr.value;
      return acc;
    }, initIncome);

    const outcome = this.transactions.reduce((acc, curr) => {
      if (curr.type === 'outcome') return acc + curr.value;
      return acc;
    }, initOutcome);

    const total = income - outcome;

    const balance: Balance = {
      income,
      total,
      outcome,
    };

    return balance;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    if (type === 'outcome') {
      const { total } = this.getBalance();

      if (value > total) throw Error("You don't have enough cash");
    }

    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
