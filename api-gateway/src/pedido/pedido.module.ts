// api-gateway/src/pedido/pedido.module.ts
import { Module } from '@nestjs/common';
import { PedidoResolver } from './pedido.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PedidoResolver],
  exports: [PedidoResolver]
})
export class PedidoModule {}