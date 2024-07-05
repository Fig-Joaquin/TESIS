import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { RolUsuario } from './rolUsuarioEntity';

@Entity('Roles')
export class Roles {
  @PrimaryGeneratedColumn()
  ID_Rol: number;

  @Column({ length: 50, unique: true })
  Rol: string;

  @OneToMany(() => RolUsuario, rolUsuario => rolUsuario.rol)
  rolUsuarios: RolUsuario[];
  
  @BeforeInsert()
  @BeforeUpdate()
  toLowerCase() {
    this.Rol = this.Rol.toLowerCase();
  }
}

