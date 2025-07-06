import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutaEntregaService } from './ruta-entrega.service';
import { RutaEntregaController } from './ruta-entrega.controller';
import { RutaEntrega } from './entities/ruta-entrega.entity';
import { Repartidor } from '../repartidor/entities/repartidor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RutaEntrega, Repartidor])],
  controllers: [RutaEntregaController],
  providers: [RutaEntregaService],
  exports: [RutaEntregaService],
})
export class RutaEntregaModule {}