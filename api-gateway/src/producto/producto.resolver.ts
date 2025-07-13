// api-gateway/src/producto/producto.resolver.ts
import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { Producto } from './entities/producto.entity';
import { CreateProductoInput } from './dto/create-producto.input';
import { UpdateProductoInput } from './dto/update-producto.input';

import { Restaurante } from '../restaurante/entities/restaurante.entity'; // Para ResolveField

// ¡ACTUALIZA ESTA URL CON EL PUERTO Y RUTA REAL DE TU MODULO_PEDIDOS!
const PRODUCTO_SERVICE_URL = 'http://localhost:3004/productos';

@Resolver(() => Producto)
export class ProductoResolver {
  constructor(private readonly httpService: HttpService) {}

  // --- QUERIES ---

  @Query(() => [Producto], { name: 'productos' })
  async findAllProductos(): Promise<Producto[]> {
    const response = await lastValueFrom(this.httpService.get<Producto[]>(PRODUCTO_SERVICE_URL));
    return response.data.map(this.mapProductoFromBackend);
  }

  @Query(() => Producto, { name: 'producto' })
  async findOneProducto(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Producto> {
    const response = await lastValueFrom(this.httpService.get<Producto>(`${PRODUCTO_SERVICE_URL}/${id}`));
    return this.mapProductoFromBackend(response.data);
  }

  // --- MUTATIONS ---

  @Mutation(() => Producto, { name: 'createProducto' })
  async createProducto(
    @Args('input') input: CreateProductoInput,
  ): Promise<Producto> {
    const payload = {
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio_regular: input.precioRegular,
      restaurante_id: input.restauranteId,
    };
    const response = await lastValueFrom(this.httpService.post<Producto>(PRODUCTO_SERVICE_URL, payload));
    return this.mapProductoFromBackend(response.data);
  }

  @Mutation(() => Producto, { name: 'updateProducto' })
  async updateProducto(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateProductoInput,
  ): Promise<Producto> {
    const payload: any = {};
    if (input.nombre !== undefined) payload.nombre = input.nombre;
    if (input.descripcion !== undefined) payload.descripcion = input.descripcion;
    if (input.precioRegular !== undefined) payload.precio_regular = input.precioRegular;
    if (input.restauranteId !== undefined) payload.restaurante_id = input.restauranteId;

    const response = await lastValueFrom(this.httpService.patch<Producto>(`${PRODUCTO_SERVICE_URL}/${id}`, payload));
    return this.mapProductoFromBackend(response.data);
  }

  @Mutation(() => Boolean, { name: 'deleteProducto' })
  async deleteProducto(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${PRODUCTO_SERVICE_URL}/${id}`));
    return true;
  }

  // --- RESOLVE FIELDS ---

  // ResolveField para Restaurante
  @ResolveField(() => Restaurante, { name: 'restaurante', nullable: true })
  async getRestaurante(@Parent() producto: Producto): Promise<Restaurante | null> {
    if (!producto.restauranteId) return null;
    const RESTAURANTE_SERVICE_URL = 'http://localhost:3004/restaurantes'; // ¡Ajusta esta URL!
    try {
      const response = await lastValueFrom(this.httpService.get<Restaurante>(`${RESTAURANTE_SERVICE_URL}/${producto.restauranteId}`));
      return { ...response.data, createdAt: new Date(), updatedAt: new Date() }; // Asume createdAt/updatedAt
    } catch (error) {
      console.error(`Error fetching restaurant for Producto ${producto.id}:`, error.message);
      return null;
    }
  }

  // Función de mapeo auxiliar
  private mapProductoFromBackend(data: any): Producto {
    return {
      ...data,
      precioRegular: data['precio_regular'],
      restauranteId: data['restaurante_id'],
      createdAt: new Date(), // Asume una fecha de creación para el campo GraphQL
      updatedAt: new Date(), // Asume una fecha de actualización
    };
  }
}