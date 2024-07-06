import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comuna } from './comunaEntity';

@Entity('Region')
export class Region {
  @PrimaryGeneratedColumn()
  ID_Region: number;

  @Column({ length: 100 })
  Nombre: string;

  @OneToMany(() => Comuna, comuna => comuna.Region)
  comunas: Comuna[];
}
