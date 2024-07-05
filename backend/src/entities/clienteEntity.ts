import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Persona } from './personaEntity';
import { Comuna } from './comunaEntity';

@Entity('Clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  ID_Cliente: number;

  @ManyToOne(() => Persona, persona => persona.clientes)
  @JoinColumn({ name: 'Rut_Persona' }) // FK
  persona: Persona;

  @ManyToOne(() => Comuna, comuna => comuna.clientes)
  @JoinColumn({ name: 'ID_Comuna' }) // FK
  comuna: Comuna;

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
}
