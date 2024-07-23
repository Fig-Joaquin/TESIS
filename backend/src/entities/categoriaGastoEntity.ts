import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gasto } from './gastoEntity';

@Entity('CategoriaGasto')
export class CategoriaGasto {
  @PrimaryGeneratedColumn()
  ID_Categoria_Gasto: number;

  @Column({ length: 100 })
  Nombre: string;

  @OneToMany(() => Gasto, gasto => gasto.CategoriaGasto)
  Gastos: Gasto[];
}
