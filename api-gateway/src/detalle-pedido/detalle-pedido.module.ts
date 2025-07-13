// api-gateway/src/detalle-pedido/detalle-pedido.module.ts
import { Module } from '@nestjs/common';
import { DetallePedidoResolver } from './detalle-pedido.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [DetallePedidoResolver],
  exports: [DetallePedidoResolver]
})
export class DetallePedidoModule {}