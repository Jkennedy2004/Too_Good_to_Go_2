// api-gateway/src/restaurante/restaurante.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { Restaurante } from './entities/restaurante.entity';
import { CreateRestauranteInput } from './dto/create-restaurante.input';
import { UpdateRestauranteInput } from './dto/update-restaurante.input';

// ¡ACTUALIZA ESTA URL CON EL PUERTO Y RUTA REAL DE TU MODULO_PEDIDOS!
const RESTAURANTE_SERVICE_URL = 'http://localhost:3004/restaurantes';

@Resolver(() => Restaurante)
export class RestauranteResolver {
  constructor(private readonly httpService: HttpService) {}

  // --- QUERIES ---

  @Query(() => [Restaurante], { name: 'restaurantes' })
  async findAllRestaurantes(): Promise<Restaurante[]> {
    const response = await lastValueFrom(this.httpService.get<Restaurante[]>(RESTAURANTE_SERVICE_URL));
    return response.data.map(this.mapRestauranteFromBackend);
  }

  @Query(() => Restaurante, { name: 'restaurante' })
  async findOneRestaurante(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Restaurante> {
    const response = await lastValueFrom(this.httpService.get<Restaurante>(`${RESTAURANTE_SERVICE_URL}/${id}`));
    return this.mapRestauranteFromBackend(response.data);
  }

  // --- MUTATIONS ---

  @Mutation(() => Restaurante, { name: 'createRestaurante' })
  async createRestaurante(
    @Args('input') input: CreateRestauranteInput,
  ): Promise<Restaurante> {
    const payload = {
      nombre: input.nombre,
      direccion: input.direccion,
      telefono: input.telefono,
      email: input.email,
    };
    const response = await lastValueFrom(this.httpService.post<Restaurante>(RESTAURANTE_SERVICE_URL, payload));
    return this.mapRestauranteFromBackend(response.data);
  }

  @Mutation(() => Restaurante, { name: 'updateRestaurante' })
  async updateRestaurante(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateRestauranteInput,
  ): Promise<Restaurante> {
    const payload: any = {};
    if (input.nombre !== undefined) payload.nombre = input.nombre;
    if (input.direccion !== undefined) payload.direccion = input.direccion;
    if (input.telefono !== undefined) payload.telefono = input.telefono;
    if (input.email !== undefined) payload.email = input.email;

    const response = await lastValueFrom(this.httpService.patch<Restaurante>(`${RESTAURANTE_SERVICE_URL}/${id}`, payload));
    return this.mapRestauranteFromBackend(response.data);
  }

  @Mutation(() => Boolean, { name: 'deleteRestaurante' })
  async deleteRestaurante(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${RESTAURANTE_SERVICE_URL}/${id}`));
    return true;
  }

  // Función de mapeo auxiliar
  private mapRestauranteFromBackend(data: any): Restaurante {
    return {
      ...data,
      createdAt: new Date(), // Asume una fecha de creación para el campo GraphQL
      updatedAt: new Date(), // Asume una fecha de actualización
    };
  }
}