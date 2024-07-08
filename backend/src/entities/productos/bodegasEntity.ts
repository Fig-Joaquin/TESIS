import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Productos } from './productosEntity';

@Entity()
export class Bodegas {
    @PrimaryGeneratedColumn()
    ID_Bodega: number;

    @Column()
    Nombre: string;

    @Column()
    Dirección: string;

    @OneToMany(() => Productos, producto => producto.ID_Bodega)
    productos: Productos[];
}
