import { Module } from '@nestjs/common';
import { OfertaReducidaService } from './oferta-reducida.service';
import { OfertaReducidaController } from './oferta-reducida.controller';

@Module({
  controllers: [OfertaReducidaController],
  providers: [OfertaReducidaService],
})
export class OfertaReducidaModule {}
