import { Module } from '@nestjs/common';
import { InventarioProductoService } from './inventario-producto.service';
import { InventarioProductoController } from './inventario-producto.controller';

@Module({
  controllers: [InventarioProductoController],
  providers: [InventarioProductoService],
})
export class InventarioProductoModule {}
