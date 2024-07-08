import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Proveedor } from './proveedorEntity';
import { Cliente } from '../clienteEntity';
import { Detalle_Pedido } from './detallePedidoEntity';

@Entity('Pedidos')
export class Pedidos {
    @PrimaryGeneratedColumn()
    ID_Pedido: number;

    @ManyToOne(() => Cliente, cliente => cliente.pedidos)
    @JoinColumn({ name: 'ID_Cliente' }) // FK
    Cliente: Cliente;

    @ManyToOne(() => Proveedor, proveedor => proveedor.pedidos)
    @JoinColumn({ name: 'ID_Proveedor' }) // FK
    Proveedor: Proveedor;

    @Column({ length: 50 })
    Tipo_Pedido: string;

    @Column()
    Fecha_Pedido: Date;

    @Column()
    Fecha_Entrega: Date;

    @Column({ length: 255 })
    Comentarios: string;

    @Column({ length: 50 })
    Estado: string;

    @OneToMany(() => Detalle_Pedido, detalle => detalle.ID_Pedido)
    detalles: Detalle_Pedido[];
}
