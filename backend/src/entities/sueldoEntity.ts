import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaccion } from './transaccionEntity';

export enum TipoSueldo {
  SEMANAL = 'semanal',
  MENSUAL = 'mensual',
  QUINCENA = 'quincena'
}

@Entity('Sueldos')
export class Sueldo {
  @PrimaryGeneratedColumn()
  ID_Sueldo: number;

  @ManyToOne(() => Transaccion)
  @JoinColumn({ name: 'ID_Transaccion' })
  ID_Transaccion: Transaccion;

  @Column({
    type: 'enum',
    enum: TipoSueldo
  })
  Tipo_Sueldo: TipoSueldo;

  @Column({ type: 'text', nullable: true })
  Descripcion: string;

}
