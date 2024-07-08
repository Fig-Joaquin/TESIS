import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedidos } from './pedidosEntity';
import { Productos } from '../productos/productosEntity';

@Entity()
export class Detalle_Pedido {
    @PrimaryGeneratedColumn()
    ID_Detalle: number;

    @ManyToOne(() => Pedidos, pedido => pedido.detalles)
    @JoinColumn({ name: 'ID_Pedido' }) // FK
    ID_Pedido: Pedidos;

    @ManyToOne(() => Productos, producto => producto.detallePedido)
    @JoinColumn({ name: 'ID_Productos' }) // FK
    ID_Producto: Productos;

    @Column()
    Cantidad: number;

    @Column()
    Precio_Total: number;

    @Column()
    Descuento: number;
}
