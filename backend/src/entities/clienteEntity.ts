import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Persona } from './personaEntity';
import { Comuna } from './comunaEntity';
import { Pedidos } from './pedidos/pedidosEntity';

@Entity('Clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  ID_Cliente: number;

  @ManyToOne(() => Persona, persona => persona.Clientes)
  @JoinColumn({ name: 'Rut_Persona' }) // FK
  Persona: Persona;

  @ManyToOne(() => Comuna, comuna => comuna.Clientes)
  @JoinColumn({ name: 'ID_Comuna' }) // FK
  Comuna: Comuna;

  @Column({ length: 255 })
  Direccion: string;

  @Column({ length: 100 })
  Nombre_Local: string;

  @Column({ length: 100 })
  Razon_Social: string;

  @Column({ length: 50 })
  Giro: string;

  @Column({ default: false })
  Mora: boolean;

  @OneToMany(() => Pedidos, pedido => pedido.Cliente)
  pedidos: Pedidos[];
}
