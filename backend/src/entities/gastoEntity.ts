import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaccion } from './transaccionEntity';
import { CategoriaGasto } from './categoriaGastoEntity';

@Entity('Gasto')
export class Gasto {
  @PrimaryGeneratedColumn()
  ID_Gasto: number;

  @ManyToOne(() => Transaccion, transaccion => transaccion.Gastos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_Transaccion' })
  Transaccion: Transaccion;

  @Column({ length: 100 })
  Nombre_Gasto: string;

  @ManyToOne(() => CategoriaGasto, categoriaGasto => categoriaGasto.Gastos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_Categoria_Gasto' })
  CategoriaGasto: CategoriaGasto;
}
