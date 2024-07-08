import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Productos } from './productosEntity';

@Entity()
export class Registro_Precios {
    @PrimaryGeneratedColumn()
    ID_Registro: number;

    @ManyToOne(() => Productos, producto => producto.registroPrecios)
    @JoinColumn({ name: 'ID_Producto' }) // FK
    ID_Producto: Productos;
    
    @Column({ nullable: true })
    Fecha_Fin: Date;
    
    @Column()
    Fecha_Creacion: Date;

    @Column('decimal')
    Precio_Neto: number;

    @Column('decimal')
    Precio_Venta: number;

}
