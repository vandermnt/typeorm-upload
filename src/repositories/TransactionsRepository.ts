import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import CategoriesRepository from './CategoriesRepository';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private balanco!: Balance;

  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;

    const transactionsIncome = await this.find({
      where: {
        type: 'income',
      },
    });

    const transactionsOutcome = await this.find({
      where: {
        type: 'outcome',
      },
    });

    transactionsIncome.forEach(transactions => {
      income += +transactions.value;
    });

    transactionsOutcome.forEach(transactions => {
      outcome += +transactions.value;
    });

    const total = income - outcome;
    const balanco = {
      income,
      outcome,
      total,
    };
    return balanco;
  }

  public async validateData({
    category,
  }: CreateTransactionDTO): Promise<string | undefined> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    // busca categoria
    const categoryExists = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryExists) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      const categoryIdNew = await categoriesRepository.save(newCategory);

      return categoryIdNew.id;
    }

    return categoryExists.id;
  }
}

export default TransactionsRepository;
