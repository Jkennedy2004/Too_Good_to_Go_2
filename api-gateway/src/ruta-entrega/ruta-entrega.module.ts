import { Module } from '@nestjs/common';
import { RutaEntregaResolver } from './ruta-entrega.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [RutaEntregaResolver],
})
export class RutaEntregaModule {}