import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Entrega } from '../../entrega/entities/entrega.entity';
import { RutaEntrega } from '../../ruta-entrega/entities/ruta-entrega.entity';

@Entity('repartidores')
export class Repartidor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255, unique: true })
  email: string;

  // Relación OneToMany con Entrega
  @OneToMany(() => Entrega, (entrega) => entrega.repartidor)
  entregas: Entrega[];

  // Relación OneToMany con RutaEntrega
  @OneToMany(() => RutaEntrega, (rutaEntrega) => rutaEntrega.repartidorAsignado)
  rutasEntrega: RutaEntrega[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}