import { Category } from '@/interfaces/category.interface';
import { Product } from '@/interfaces/product.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'Products' })
export class ProductEntity implements Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  sku: string;

  @Column({ type: 'varchar', length: 100 })
  imageURL: string;

  @Column('int')
  stockLevel: number;

  @Column('int')
  sellingPrice: number;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  colours: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  sizes: string[];

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CategoryEntity, category => category.products)
  category: Category;
}
