import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Persona } from './personaEntity';
import { Comuna } from './comunaEntity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  ID_Cliente: number;

  @ManyToOne(() => Persona, persona => persona.clientes)
  @JoinColumn({ name: 'Rut_Persona' }) // Rut_Persona de la tabla Persona Llave Foranea
  persona: Persona;

  @ManyToOne(() => Comuna, comuna => comuna.clientes)
  @JoinColumn({ name: 'ID_Comuna' }) // ID_Comuna de la tabla Comuna Llave Foranea
  comuna: Comuna;

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

  // Nuevos atributos
  @Column({ length: 50, nullable: true })
  Region: string;

  @Column({ length: 50, nullable: true })
  AnotherNewAttribute: string;
}
