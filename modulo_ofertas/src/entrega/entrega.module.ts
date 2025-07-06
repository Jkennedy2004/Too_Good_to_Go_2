import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntregaService } from './entrega.service';
import { EntregaController } from './entrega.controller';
import { Entrega } from './entities/entrega.entity';
import { Repartidor } from '../repartidor/entities/repartidor.entity';
import { RutaEntrega } from '../ruta-entrega/entities/ruta-entrega.entity';
import { OfertaReducida } from '../oferta-reducida/entities/oferta-reducida.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entrega, Repartidor, RutaEntrega, OfertaReducida]),
  ],
  controllers: [EntregaController],
  providers: [EntregaService],
  exports: [EntregaService],
})
export class EntregaModule {}