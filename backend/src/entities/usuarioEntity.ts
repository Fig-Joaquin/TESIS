import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Persona } from './personaEntity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  ID_Usuario: number;

  @ManyToOne(() => Persona, persona => persona.usuarios)
  persona: Persona;

  @Column({ length: 50 })
  Rol_Usuario: string;

  @Column()
  Password_Hash: string;
}
