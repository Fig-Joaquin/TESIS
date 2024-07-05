import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Region } from './regionEntity';
import { Cliente } from './clienteEntity';

@Entity('Comunas')
export class Comuna {
  @PrimaryGeneratedColumn()
  ID_Comuna: number;

  @Column({ length: 100 })
  Nombre: string;

  @ManyToOne(() => Region, region => region.comunas, { onDelete: 'CASCADE' })
  region: Region;

  @OneToMany(() => Cliente, cliente => cliente.comuna)
  clientes: Cliente[];
}
