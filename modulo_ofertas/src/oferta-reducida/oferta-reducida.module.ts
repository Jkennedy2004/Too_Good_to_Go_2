import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaReducidaService } from './oferta-reducida.service';
import { OfertaReducidaController } from './oferta-reducida.controller';
import { OfertaReducida } from './entities/oferta-reducida.entity';
import { InventarioProducto } from '../inventario-producto/entities/inventario-producto.entity';
import { Entrega } from '../entrega/entities/entrega.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfertaReducida, InventarioProducto, Entrega]),
  ],
  controllers: [OfertaReducidaController],
  providers: [OfertaReducidaService],
  exports: [OfertaReducidaService],
})
export class OfertaReducidaModule {}