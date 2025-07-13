// api-gateway/src/pedido/pedido.resolver.ts
import { Resolver, Query, Mutation, Args, ID, Context, ResolveField, Parent } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { Pedido } from './entities/pedido.entity';
import { CreatePedidoInput } from './dto/create-pedido.input';
import { UpdatePedidoInput } from './dto/update-pedido.input';

// Importa las entidades relacionadas para los ResolveFields
import { Usuario } from '../usuario/entities/usuario.entity';
import { Restaurante } from '../restaurante/entities/restaurante.entity';
import { DetallePedido } from '../detalle-pedido/entities/detalle-pedido.entity';

// ¡ACTUALIZA ESTA URL CON EL PUERTO Y RUTA REAL DE TU MODULO_PEDIDOS!
const PEDIDO_SERVICE_URL = 'http://localhost:3004/pedidos';

@Resolver(() => Pedido)
export class PedidoResolver {
  constructor(private readonly httpService: HttpService) {}

  // --- QUERIES ---

  @Query(() => [Pedido], { name: 'pedidos' })
  async findAllPedidos(): Promise<Pedido[]> {
    const response = await lastValueFrom(this.httpService.get<Pedido[]>(PEDIDO_SERVICE_URL));
    return response.data.map(this.mapPedidoFromBackend);
  }

  @Query(() => Pedido, { name: 'pedido' })
  async findOnePedido(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Pedido> {
    const response = await lastValueFrom(this.httpService.get<Pedido>(`${PEDIDO_SERVICE_URL}/${id}`));
    return this.mapPedidoFromBackend(response.data);
  }

  // --- MUTATIONS ---

  @Mutation(() => Pedido, { name: 'createPedido' })
  async createPedido(
    @Args('input') input: CreatePedidoInput,
  ): Promise<Pedido> {
    // Mapeo de CamelCase a Snake_case para el backend Python
    const payload = {
      usuario_id: input.usuarioId,
      restaurante_id: input.restauranteId,
      estado: input.estado,
      total: input.total,
      detalles: input.detalles?.map(d => ({
        producto_id: d.productoId,
        cantidad: d.cantidad,
        precio_unitario: d.precioUnitario,
        subtotal: d.subtotal,
        oferta_reducida_id: d.ofertaReducidaId,
      }))
    };
    const response = await lastValueFrom(this.httpService.post<Pedido>(PEDIDO_SERVICE_URL, payload));
    return this.mapPedidoFromBackend(response.data);
  }

  @Mutation(() => Pedido, { name: 'updatePedido' })
  async updatePedido(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdatePedidoInput,
  ): Promise<Pedido> {
    // Mapeo de CamelCase a Snake_case solo para los campos que se actualizan
    const payload: any = {};
    if (input.estado !== undefined) payload.estado = input.estado;
    if (input.total !== undefined) payload.total = input.total;

    const response = await lastValueFrom(this.httpService.patch<Pedido>(`${PEDIDO_SERVICE_URL}/${id}`, payload));
    return this.mapPedidoFromBackend(response.data);
  }

  @Mutation(() => Boolean, { name: 'deletePedido' })
  async deletePedido(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${PEDIDO_SERVICE_URL}/${id}`));
    return true;
  }

  // --- RESOLVE FIELDS (para relaciones anidadas, si el backend las expone) ---
  // Asumimos que los detalles_pedido vienen anidados directamente en la respuesta de PedidoInDB
  // Si no vienen anidados, necesitarías hacer una llamada separada aquí.
  // Por ahora, el mapPedidoFromBackend ya debería incluirlos.

  // ResolveField para Usuario
  @ResolveField(() => Usuario, { name: 'usuario', nullable: true })
  async getUsuario(@Parent() pedido: Pedido): Promise<Usuario | null> {
    if (!pedido.usuarioId) return null;
    const USUARIO_SERVICE_URL = 'http://localhost:3004/usuarios'; // ¡Ajusta esta URL si el servicio de Usuario es diferente!
    try {
      const response = await lastValueFrom(this.httpService.get<Usuario>(`${USUARIO_SERVICE_URL}/${pedido.usuarioId}`));
      // Mapeo similar para el objeto Usuario si sus campos son snake_case
      return { ...response.data, createdAt: new Date(response.data['created_at'] || response.data['fecha_creacion']), updatedAt: new Date(response.data['updated_at'] || response.data['fecha_creacion']) };
    } catch (error) {
      console.error(`Error fetching user for Pedido ${pedido.id}:`, error.message);
      return null;
    }
  }

  // ResolveField para Restaurante
  @ResolveField(() => Restaurante, { name: 'restaurante', nullable: true })
  async getRestaurante(@Parent() pedido: Pedido): Promise<Restaurante | null> {
    if (!pedido.restauranteId) return null;
    const RESTAURANTE_SERVICE_URL = 'http://localhost:3004/restaurantes'; // ¡Ajusta esta URL si el servicio de Restaurante es diferente!
    try {
      const response = await lastValueFrom(this.httpService.get<Restaurante>(`${RESTAURANTE_SERVICE_URL}/${pedido.restauranteId}`));
      // Mapeo similar para el objeto Restaurante
      return { ...response.data, createdAt: new Date(response.data['created_at'] || response.data['fecha_creacion']), updatedAt: new Date(response.data['updated_at'] || response.data['fecha_creacion']) };
    } catch (error) {
      console.error(`Error fetching restaurant for Pedido ${pedido.id}:`, error.message);
      return null;
    }
  }

  // Función de mapeo auxiliar para evitar repetición
  private mapPedidoFromBackend(data: any): Pedido {
    const mappedDetalles = data.detalles_pedido ? data.detalles_pedido.map((dp: any) => ({
        id: dp.id,
        pedidoId: dp.pedido_id,
        productoId: dp.producto_id,
        ofertaReducidaId: dp.oferta_reducida_id,
        cantidad: dp.cantidad,
        precioUnitario: dp.precio_unitario,
        subtotal: dp.subtotal,
    })) : [];

    return {
      ...data,
      usuarioId: data['usuario_id'],
      restauranteId: data['restaurante_id'],
      fechaCreacion: new Date(data['fecha_creacion']),
      detallesPedido: mappedDetalles, // Asigna los detalles mapeados
      createdAt: new Date(data['fecha_creacion']),
      updatedAt: new Date(data['fecha_creacion']),
    };
  }
}