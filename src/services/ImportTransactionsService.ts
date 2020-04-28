import csv from 'csv-parse';
import fs from 'fs';

import { In, getRepository, getCustomRepository } from 'typeorm';

import ModelCategories from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface TransactionsCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStrem = fs.createReadStream(filePath);

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(ModelCategories);

    const parsers = csv({
      from_line: 2,
    });

    const parseCSV = contactsReadStrem.pipe(parsers);

    const transactions: TransactionsCSV[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async lines => {
      const [title, type, value, category] = lines.map((cell: string) =>
        cell.trim(),
      );

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    // verifica se existem categorias no banco com esse title
    const checkExistCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = checkExistCategories.map(
      (category: ModelCategories) => category.title,
    );

    // // exclui categorias duplicadas no array
    const addCategory = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategory.map(title => ({
        title,
      })),
    );
    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...checkExistCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);
    return createdTransactions;
  }
}

export default ImportTransactionsService;
