import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Usuario } from './usuarioEntity';
import { Cliente } from './clienteEntity';
import { Sueldo } from './sueldoEntity';

@Entity('Personas')
export class Persona {
  @PrimaryGeneratedColumn()
  ID_Persona: number;

  @Column({ length: 12, unique: true })
  Rut_Persona: string;

  @Column({ length: 100 })
  Nombre: string;

  @Column({ length: 100 })
  Primer_apellido: string;

  @Column({ length: 100 })
  Segundo_apellido: string;

  @Column({ length: 100 })
  Email: string;

  @Column({ length: 20 })
  Telefono: string;

  @OneToMany(() => Usuario, usuario => usuario.persona)
  Usuarios: Usuario[];

  @OneToMany(() => Cliente, cliente => cliente.Persona)
  Clientes: Cliente[];

  @OneToMany(() => Sueldo, sueldo => sueldo.ID_Persona)
  Sueldos: Sueldo[];

  @BeforeInsert()
  @BeforeUpdate()
  formatFields() {
    // Convertir Rut_Persona y Email a minúsculas
    this.Rut_Persona = this.Rut_Persona.toLowerCase();

    if(!this.Email == undefined || null)
      this.Email = this.Email.toLowerCase();
    
    // Asegurar que el Rut_Persona termine con 'k' minúscula si es necesario
    const rutLength = this.Rut_Persona.length;

    if (rutLength > 1 && this.Rut_Persona[rutLength - 1].toLowerCase() === 'k') {
      this.Rut_Persona = this.Rut_Persona.slice(0, rutLength - 1) + 'k';
    }
  }
}
