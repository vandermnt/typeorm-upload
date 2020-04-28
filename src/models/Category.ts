import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // OneToMany,
  // JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
// import Transaction from './Transaction';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}

export default Category;
