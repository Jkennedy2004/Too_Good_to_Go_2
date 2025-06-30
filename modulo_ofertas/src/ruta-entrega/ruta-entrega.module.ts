import { Module } from '@nestjs/common';
import { RutaEntregaService } from './ruta-entrega.service';
import { RutaEntregaController } from './ruta-entrega.controller';

@Module({
  controllers: [RutaEntregaController],
  providers: [RutaEntregaService],
})
export class RutaEntregaModule {}
