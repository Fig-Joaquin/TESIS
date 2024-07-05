import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comuna } from './comunaEntity';

@Entity('Regiones')
export class Region {
  @PrimaryGeneratedColumn()
  ID_Region: number;

  @Column({ length: 100 })
  Nombre: string;

  @OneToMany(() => Comuna, comuna => comuna.region)
  comunas: Comuna[];
}
