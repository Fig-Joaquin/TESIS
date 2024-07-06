import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuarioEntity';
import { Roles } from './rolesEntity';

@Entity('Rol_Usuario')
export class RolUsuario {
  @PrimaryGeneratedColumn()
  ID_Rol_Usuario: number;

  // Number
  @ManyToOne(() => Usuario, usuario => usuario.roles)
  @JoinColumn({ name: 'ID_Usuario' })
  usuario: Usuario;
  
  // Number
  @ManyToOne(() => Roles, rol => rol.rolUsuarios)
  @JoinColumn({ name: 'ID_Rol' })
  rol: Roles;
}
