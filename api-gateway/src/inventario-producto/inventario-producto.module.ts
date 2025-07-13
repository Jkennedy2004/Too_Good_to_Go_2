import { Module } from '@nestjs/common';
import { InventarioProductoResolver } from './inventario-producto.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [InventarioProductoResolver],
})
export class InventarioProductoModule {}