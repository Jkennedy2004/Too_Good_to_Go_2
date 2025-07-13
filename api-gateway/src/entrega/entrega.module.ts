import { Module } from '@nestjs/common';
import { EntregaResolver } from './entrega.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EntregaResolver],
})
export class EntregaModule {}