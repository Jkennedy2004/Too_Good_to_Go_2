import { Module } from '@nestjs/common';
import { RepartidorResolver } from './repartidor.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [RepartidorResolver],
})
export class RepartidorModule {}