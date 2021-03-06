import { Category } from '@/interfaces/category.interface';
import { Product } from '@/interfaces/product.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'Categories' })
export class CategoryEntity implements Category {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  imageURL: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProductEntity, product => product.category)
  products: Product[];
}
