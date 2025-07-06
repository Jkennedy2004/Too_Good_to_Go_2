import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { InventarioProducto } from '../../inventario-producto/entities/inventario-producto.entity';
import { Entrega } from '../../entrega/entities/entrega.entity';

@Entity('ofertas_reducidas')
export class OfertaReducida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string; // Nombre de la oferta

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioReducido: number; // Precio de la oferta

  @Column({ type: 'int' })
  cantidadDisponible: number; // Cantidad disponible para la oferta

  @Column({ type: 'timestamp with time zone' })
  fechaHoraFinRecogida: Date; // Hora límite para recoger

  @Column({ default: true })
  activo: boolean; // Si la oferta está activa

  @Column()
  inventarioProductoId: number; // FK al InventarioProducto

  // Relación ManyToOne con InventarioProducto
  @ManyToOne(
    () => InventarioProducto,
    (inventarioProducto) => inventarioProducto.ofertasReducidas,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'inventarioProductoId' })
  inventarioProducto: InventarioProducto;

  // Relación OneToOne con Entrega (una oferta puede tener una entrega asociada)
  @OneToOne(() => Entrega, (entrega) => entrega.ofertaReducida)
  entrega: Entrega | null; // Puede ser nula si no tiene entrega asignada

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}