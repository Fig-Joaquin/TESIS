import { Entity, PrimaryColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Usuario } from './usuarioEntity';
import { Cliente } from './clienteEntity';

@Entity()
export class Persona {
  @PrimaryColumn()
  Rut_Persona: string;

  @Column({ length: 100 })
  Nombre: string;

  @Column({ length: 100 })
  Primer_apellido: string;

  @Column({ length: 100 })
  Segundo_apellido: string;

  @Column({ length: 100, unique: true })
  Email: string;

  @Column({ length: 20 })
  Telefono: string;

  @OneToMany(() => Usuario, usuario => usuario.persona)
  usuarios: Usuario[];

  @OneToMany(() => Cliente, cliente => cliente.persona)
  clientes: Cliente[];

  @BeforeInsert()
  @BeforeUpdate()
  formatFields() {
     // Convertir Rut_Persona y Email a minúsculas
    this.Rut_Persona = this.Rut_Persona.toLowerCase();
    this.Email = this.Email.toLowerCase();
    
    // Asegurar que el Rut_Persona termine con 'k' minúscula si es necesario
    if (this.Rut_Persona.endsWith('k')) {
      this.Rut_Persona = this.Rut_Persona.slice(0, -1) + 'k';
    }
  }
}
