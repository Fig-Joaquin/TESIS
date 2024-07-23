import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {Gasto} from './gastoEntity';

export enum TipoTransaccion {
  INGRESO = 'Ingreso',
  EGRESO = 'Egreso',
}

@Entity('Transacciones')
export class Transaccion {
  @PrimaryGeneratedColumn()
  ID_Transaccion: number;

  @Column({ type: 'date' })
  Fecha: Date;

  @Column({
    type: 'enum',
    enum: TipoTransaccion,
  })
  Tipo: TipoTransaccion;

  @OneToMany(() => Gasto, gasto => gasto.Transaccion)
  Gastos: Gasto[];
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Monto: number;

  @Column({ type: 'text', nullable: true })
  Descripcion: string;
}
