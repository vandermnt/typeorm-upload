import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';
// import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    // const categoriesRepository = getCustomRepository(CategoriesRepository);

    const balance = await transactionRepository.getBalance();

    if (balance.total < value && type === 'outcome') {
      throw new AppError('Balance invalid!');
    }

    const id_category = await transactionRepository.validateData({
      value,
      type,
      category,
    });

    // const teste = await categoriesRepository.findOne(id_category);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: id_category,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
