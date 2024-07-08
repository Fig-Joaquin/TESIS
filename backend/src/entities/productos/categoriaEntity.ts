import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Productos } from './productosEntity';

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    ID_Categoria: number;

    @Column()
    Tipo: string;

    @OneToMany(() => Productos, producto => producto.ID_Categoria)
    productos: Productos[];
}