import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OfertaReducida } from '../../oferta-reducida/entities/oferta-reducida.entity';

@Entity('inventario_productos')
export class InventarioProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string; // Nombre simplificado del producto

  @Column({ type: 'int' })
  cantidadActual: number; // Cantidad actual en inventario

  @Column({ default: true })
  activo: boolean; // Si el producto está activo o no

  // Relación OneToMany con OfertaReducida
  @OneToMany(
    () => OfertaReducida,
    (ofertaReducida) => ofertaReducida.inventarioProducto,
  )
  ofertasReducidas: OfertaReducida[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}