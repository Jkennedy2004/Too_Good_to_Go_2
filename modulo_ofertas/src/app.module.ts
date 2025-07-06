import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos de entidades
import { EntregaModule } from './entrega/entrega.module';
import { InventarioProductoModule } from './inventario-producto/inventario-producto.module';
import { OfertaReducidaModule } from './oferta-reducida/oferta-reducida.module';
import { RepartidorModule } from './repartidor/repartidor.module';
import { RutaEntregaModule } from './ruta-entrega/ruta-entrega.module';

// Entidades para la configuración de TypeORM
import { Entrega } from './entrega/entities/entrega.entity';
import { InventarioProducto } from './inventario-producto/entities/inventario-producto.entity';
import { OfertaReducida } from './oferta-reducida/entities/oferta-reducida.entity';
import { Repartidor } from './repartidor/entities/repartidor.entity';
import { RutaEntrega } from './ruta-entrega/entities/ruta-entrega.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // ¡CAMBIA ESTO!
      password: '1234', // ¡CAMBIA ESTO!
      database: 'Too_good_to_go2', // ¡CAMBIA ESTO!
      entities: [
        Entrega,
        InventarioProducto,
        OfertaReducida,
        Repartidor,
        RutaEntrega,
      ],
      synchronize: true, // ¡Solo para desarrollo! No usar en producción.
      logging: true,
    }),
    EntregaModule,
    InventarioProductoModule,
    OfertaReducidaModule,
    RepartidorModule,
    RutaEntregaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}