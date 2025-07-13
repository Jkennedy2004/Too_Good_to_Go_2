import { Module } from '@nestjs/common'; // <-- ¡Asegúrate de que esta línea exista!
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Importa aquí cada módulo GraphQL que vayas creando
import { OfertaReducidaModule } from './oferta-reducida/oferta-reducida.module';
import { RutaEntregaModule } from './ruta-entrega/ruta-entrega.module';
import { EntregaModule } from './entrega/entrega.module';
import { RepartidorModule } from './repartidor/repartidor.module';
import { InventarioProductoModule } from './inventario-producto/inventario-producto.module';
import { PedidoModule } from './pedido/pedido.module';
import { DetallePedidoModule } from './detalle-pedido/detalle-pedido.module';
import { ProductoModule } from './producto/producto.module';
import { RestauranteModule } from './restaurante/restaurante.module';
import { UsuarioModule } from './usuario/usuario.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    OfertaReducidaModule,
    RutaEntregaModule,
    EntregaModule,
    RepartidorModule,
    InventarioProductoModule,
    PedidoModule,
    DetallePedidoModule,
    ProductoModule,
    RestauranteModule,
    UsuarioModule,
    // Descomenta estos cuando estén creados y funcionando
    // RepartidorModule,
    // InventarioProductoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}