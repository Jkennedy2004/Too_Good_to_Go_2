import { Module } from '@nestjs/common';
import { OfertaReducidaResolver } from './oferta-reducida.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], // HttpModule.register({}) ya se hace a nivel global si lo deseas, o aquí localmente
  providers: [OfertaReducidaResolver],
})
export class OfertaReducidaModule {}