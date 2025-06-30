import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntregaModule } from './entrega/entrega.module';
import { InventarioProductoModule } from './inventario-producto/inventario-producto.module';
import { OfertaReducidaModule } from './oferta-reducida/oferta-reducida.module';
import { RepartidorModule } from './repartidor/repartidor.module';
import { RutaEntregaModule } from './ruta-entrega/ruta-entrega.module';

@Module({
  imports: [EntregaModule, InventarioProductoModule, OfertaReducidaModule, RepartidorModule, RutaEntregaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
