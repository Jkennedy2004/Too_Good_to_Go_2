import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioProductoService } from './inventario-producto.service';
import { InventarioProductoController } from './inventario-producto.controller';
import { InventarioProducto } from './entities/inventario-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventarioProducto])],
  controllers: [InventarioProductoController],
  providers: [InventarioProductoService],
  exports: [InventarioProductoService],
})
export class InventarioProductoModule {}