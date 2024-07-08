import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { Bodegas } from './bodegasEntity';
import { Categoria } from './categoriaEntity';
import { Proveedor } from '../pedidos/proveedorEntity';
import { Detalle_Pedido } from '../pedidos/detallePedidoEntity';
import { Registro_Precios } from './registroPreciosEntity';
import { Devoluciones } from './devolucionesEntity';

@Entity()
export class Productos {
    @PrimaryGeneratedColumn()
    ID_Producto: number;

    @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
    @JoinColumn({ name: 'ID_Proveedor' }) //FK
    ID_Proveedor: Proveedor;

    @ManyToOne(() => Categoria, categoria => categoria.productos)
    @JoinColumn({ name: 'ID_Categoria' }) //FK
    ID_Categoria: Categoria;

    @ManyToOne(() => Bodegas, bodegas => bodegas.productos)
    @JoinColumn({ name: 'ID_Bodega' }) //FK
    ID_Bodega: Bodegas;

    @Column()
    Nombre: string;

    @Column()
    Descripcion: string;

    @Column('decimal')
    Precio_Neto: number;

    @Column('decimal')
    Precio_Venta: number;

    @Column()
    Fecha_Ingreso: Date;

    @Column()
    Unidad_Medida: string;

    @Column('decimal')
    Stock_Unidades: number;

    @Column('decimal')
    Stock_Cajas: number;

    @Column()
    Unidades_Por_Caja: number;

    @Column()
    SKU: string;

    @Column('decimal')
    Descuento: number;

    @OneToMany(() => Detalle_Pedido, detallePedido => detallePedido.ID_Producto)
    detallePedido: Detalle_Pedido[];

    @OneToMany(() => Registro_Precios, registroPrecios => registroPrecios.ID_Producto)
    registroPrecios: Registro_Precios[];

    @OneToMany(() => Devoluciones, devoluciones => devoluciones.ID_Producto)
    devoluciones: Devoluciones[];
}
