import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Entrega } from '../../entrega/entities/entrega.entity';
import { Repartidor } from '../../repartidor/entities/repartidor.entity';

export enum EstadoRuta {
  PLANIFICADA = 'PLANIFICADA',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

@Entity('rutas_entrega')
export class RutaEntrega {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombreRuta: string;

  @Column({
    type: 'enum',
    enum: EstadoRuta,
    default: EstadoRuta.PLANIFICADA,
  })
  estado: EstadoRuta;

  @Column({ nullable: true })
  repartidorAsignadoId: number; // FK al Repartidor

  @ManyToOne(() => Repartidor, (repartidor) => repartidor.rutasEntrega, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'repartidorAsignadoId' })
  repartidorAsignado: Repartidor | null; // Puede ser nulo

  // Relación OneToMany con Entrega
  @OneToMany(() => Entrega, (entrega) => entrega.rutaEntrega)
  entregas: Entrega[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}