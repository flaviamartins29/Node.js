import Transaction from '../models/Transaction';
// interface dor types of properts
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;

  }
//claculate
  public getBalance(): Balance {
    const { income, outcome, total } = this.transactions.reduce((sum, transaction) => {
      switch (transaction.type) {
        case 'income':
          sum.income += transaction.value;
          sum.total += transaction.value;
          break;
        case 'outcome':
          sum.outcome += transaction.value;
          sum.total -= transaction.value;
          break;
        default:
          break;
      }
      return sum;

    }, {
      income: 0,
      outcome: 0,
      total: 0
    }
    );
    return { income, outcome, total };
  }

  public create({ title, value, type }: Omit<Transaction, 'id'> ): Transaction {

    if(this.getBalance().total < value && type === 'outcome') {
      throw Error('Not enought founds!');

    } else {
      const transaction = new Transaction({ title, value, type });
      this.transactions.push(transaction);
      return transaction;
    }
  }

  protected sumTransactionsByType(type:'income'|'outcome'): number {
    const incomes = this.transactions.filter((transaction) => {
      transaction.type === type;
    });
    var value = 0;
    incomes.forEach(element => {
      value += element.value;
    });
    return value;
  }
}

export default TransactionsRepository;
