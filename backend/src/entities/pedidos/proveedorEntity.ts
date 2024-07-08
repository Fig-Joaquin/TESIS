import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Productos } from '../productos/productosEntity';
import { Pedidos } from './pedidosEntity';

@Entity()
export class Proveedor {
    @PrimaryGeneratedColumn()
    ID_Proveedor: number;

    @Column()
    Nombre_Empresa: string;

    @Column()
    Telefono: string;

    @Column()
    Razon_Social: string;

    @Column()
    Direccion: string;

    @OneToMany(() => Productos, producto => producto.ID_Proveedor)
    productos: Productos[];

    @OneToMany(() => Pedidos, pedido => pedido.Proveedor)
    pedidos: Pedidos[];
}
