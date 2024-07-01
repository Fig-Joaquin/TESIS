import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Persona } from './personaEntity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  ID_Cliente: number;

  @ManyToOne(() => Persona, persona => persona.clientes)
  persona: Persona;

  @Column({ length: 255 })
  Direccion: string;

  @Column({ length: 100 })
  Nombre_Local: string;

  @Column({ length: 100 })
  Razon_Social: string;

  @Column({ length: 50 })
  Giro: string;

  @Column()
  Mora: boolean;

  @Column({ length: 100 })
  Campo: string;
}
