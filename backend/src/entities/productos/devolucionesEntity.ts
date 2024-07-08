import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Productos } from './productosEntity';

@Entity()
export class Devoluciones {
    @PrimaryGeneratedColumn()
    ID_Devolucion: number;

    @ManyToOne(() => Productos, producto => producto.devoluciones)
    @JoinColumn({ name: 'ID_Producto' }) // FK
    ID_Producto: Productos;

    @Column('decimal')
    Cantidad_Unidades: number;

    @Column('decimal')
    Cantidad_Cajas: number;

    @Column()
    Fecha_Devolucion: Date;

    @Column()
    Razon: string;
}
