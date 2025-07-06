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
import { Repartidor } from '../../repartidor/entities/repartidor.entity';
import { OfertaReducida } from '../../oferta-reducida/entities/oferta-reducida.entity';
import { RutaEntrega } from '../../ruta-entrega/entities/ruta-entrega.entity';

@Entity('entregas')
export class Entrega {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaEntrega: Date;

  @Column({ nullable: true })
  repartidorId: number;

  @Column({ nullable: true })
  rutaEntregaId: number;

  @Column({ nullable: true, unique: true })
  ofertaReducidaId: number;

  // Relación ManyToOne con Repartidor
  @ManyToOne(() => Repartidor, (repartidor) => repartidor.entregas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'repartidorId' })
  repartidor: Repartidor | null; // Puede ser nulo

  // Relación OneToOne con OfertaReducida (LADO PROPIETARIO)
  @OneToOne(() => OfertaReducida, (ofertaReducida) => ofertaReducida.entrega, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ofertaReducidaId' })
  ofertaReducida: OfertaReducida | null; // Puede ser nula

  // Relación ManyToOne con RutaEntrega
  @ManyToOne(() => RutaEntrega, (ruta) => ruta.entregas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'rutaEntregaId' })
  rutaEntrega: RutaEntrega | null; // Puede ser nula

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}