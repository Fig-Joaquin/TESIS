import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Region } from './regionEntity';
import { Cliente } from './clienteEntity';

@Entity('Comuna')
export class Comuna {
  @PrimaryGeneratedColumn()
  ID_Comuna: number;

  @Column({ length: 100 })
  Nombre: string;

  @ManyToOne(() => Region, region => region.comunas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_Region' })
  Region: Region;

  @OneToMany(() => Cliente, cliente => cliente.Comuna)
  Clientes: Cliente[];
}
