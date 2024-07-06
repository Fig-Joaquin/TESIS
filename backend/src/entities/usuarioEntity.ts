import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Persona } from './personaEntity';
import { RolUsuario } from './rolUsuarioEntity';

@Entity('Usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  ID_Usuario: number;

  @ManyToOne(() => Persona, persona => persona.Usuarios)
  @JoinColumn({ name: 'ID_Persona' })
  persona: Persona;

  @Column()
  Contrasenia: string;

  @OneToMany(() => RolUsuario, rolUsuario => rolUsuario.usuario)
  roles: RolUsuario[];
}
