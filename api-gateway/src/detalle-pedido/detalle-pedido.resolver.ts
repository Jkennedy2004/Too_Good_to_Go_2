// api-gateway/src/detalle-pedido/detalle-pedido.resolver.ts
import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { DetallePedido } from './entities/detalle-pedido.entity';
import { CreateDetallePedidoInput } from './dto/create-detalle-pedido.input';
import { UpdateDetallePedidoInput } from './dto/update-detalle-pedido.input';

import { Producto } from '../producto/entities/producto.entity'; // Para ResolveField

// ¡ACTUALIZA ESTA URL CON EL PUERTO Y RUTA REAL DE TU MODULO_PEDIDOS!
const DETALLE_PEDIDO_SERVICE_URL = 'http://localhost:3004/detalles_pedido';

@Resolver(() => DetallePedido)
export class DetallePedidoResolver {
  constructor(private readonly httpService: HttpService) {}

  // --- QUERIES ---

  @Query(() => [DetallePedido], { name: 'detallesPedido' })
  async findAllDetallesPedido(): Promise<DetallePedido[]> {
    const response = await lastValueFrom(this.httpService.get<DetallePedido[]>(DETALLE_PEDIDO_SERVICE_URL));
    return response.data.map(this.mapDetallePedidoFromBackend);
  }

  @Query(() => DetallePedido, { name: 'detallePedido' })
  async findOneDetallePedido(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<DetallePedido> {
    const response = await lastValueFrom(this.httpService.get<DetallePedido>(`${DETALLE_PEDIDO_SERVICE_URL}/${id}`));
    return this.mapDetallePedidoFromBackend(response.data);
  }

  // --- MUTATIONS ---

  @Mutation(() => DetallePedido, { name: 'createDetallePedido' })
  async createDetallePedido(
    @Args('input') input: CreateDetallePedidoInput,
  ): Promise<DetallePedido> {
    // Nota: El backend de DetallePedidoCreate no tiene pedido_id. Se asigna en el endpoint de Pedido
    // o en un endpoint específico de DetallePedido que lo reciba.
    // Si tu backend lo espera, debes añadirlo aquí.
    const payload = {
      producto_id: input.productoId,
      cantidad: input.cantidad,
      precio_unitario: input.precioUnitario,
      subtotal: input.subtotal,
      oferta_reducida_id: input.ofertaReducidaId,
      // Si el backend necesita pedido_id aquí para crear un detalle_pedido aislado:
      // pedido_id: input.pedidoId,
    };
    const response = await lastValueFrom(this.httpService.post<DetallePedido>(DETALLE_PEDIDO_SERVICE_URL, payload));
    return this.mapDetallePedidoFromBackend(response.data);
  }

  @Mutation(() => DetallePedido, { name: 'updateDetallePedido' })
  async updateDetallePedido(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateDetallePedidoInput,
  ): Promise<DetallePedido> {
    const payload: any = {};
    if (input.cantidad !== undefined) payload.cantidad = input.cantidad;
    if (input.precioUnitario !== undefined) payload.precio_unitario = input.precioUnitario;
    if (input.subtotal !== undefined) payload.subtotal = input.subtotal;
    if (input.ofertaReducidaId !== undefined) payload.oferta_reducida_id = input.ofertaReducidaId;
    if (input.productoId !== undefined) payload.producto_id = input.productoId; // Aunque no esté en Pydantic Update
    // No se actualiza pedido_id ya que es una FK fuerte.

    const response = await lastValueFrom(this.httpService.patch<DetallePedido>(`${DETALLE_PEDIDO_SERVICE_URL}/${id}`, payload));
    return this.mapDetallePedidoFromBackend(response.data);
  }

  @Mutation(() => Boolean, { name: 'deleteDetallePedido' })
  async deleteDetallePedido(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${DETALLE_PEDIDO_SERVICE_URL}/${id}`));
    return true;
  }

  // --- RESOLVE FIELDS ---

  // ResolveField para Producto
  @ResolveField(() => Producto, { name: 'producto', nullable: true })
  async getProducto(@Parent() detallePedido: DetallePedido): Promise<Producto | null> {
    if (!detallePedido.productoId) return null;
    const PRODUCTO_SERVICE_URL = 'http://localhost:3004/productos'; // ¡Ajusta esta URL si el servicio de Producto es diferente!
    try {
      const response = await lastValueFrom(this.httpService.get<Producto>(`${PRODUCTO_SERVICE_URL}/${detallePedido.productoId}`));
      // Mapeo similar para el objeto Producto
      return { ...response.data, createdAt: new Date(), updatedAt: new Date() }; // Asume createdAt/updatedAt si no están en Producto backend
    } catch (error) {
      console.error(`Error fetching product for DetallePedido ${detallePedido.id}:`, error.message);
      return null;
    }
  }

  // Función de mapeo auxiliar
  private mapDetallePedidoFromBackend(data: any): DetallePedido {
    return {
      ...data,
      pedidoId: data['pedido_id'],
      productoId: data['producto_id'],
      ofertaReducidaId: data['oferta_reducida_id'],
      precioUnitario: data['precio_unitario'],
    };
  }
}