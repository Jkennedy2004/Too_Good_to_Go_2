import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { RutaEntrega, EstadoRuta } from './entities/ruta-entrega.entity';
import { CreateRutaEntregaInput } from './dto/create-ruta-entrega.input';
import { UpdateRutaEntregaInput } from './dto/update-ruta-entrega.input'; 

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Repartidor } from '../repartidor/entities/repartidor.entity';

const RUTA_ENTREGA_SERVICE_URL = 'http://localhost:3000/rutas-entrega'; 
const REPARTIDOR_SERVICE_URL = 'http://localhost:3000/repartidores';

@Resolver(() => RutaEntrega)
export class RutaEntregaResolver {
  constructor(private readonly httpService: HttpService) {}

  @Query(() => [RutaEntrega], { name: 'rutasEntrega' })
  async findAllRutasEntrega(): Promise<RutaEntrega[]> {
    const response = await lastValueFrom(this.httpService.get<RutaEntrega[]>(RUTA_ENTREGA_SERVICE_URL));
    return response.data;
  }

  @Query(() => RutaEntrega, { name: 'rutaEntrega' })
  async findOneRutaEntrega(@Args('id', { type: () => ID }) id: number): Promise<RutaEntrega> {
    const response = await lastValueFrom(this.httpService.get<RutaEntrega>(`${RUTA_ENTREGA_SERVICE_URL}/${id}`));
    return response.data;
  }

  @Mutation(() => RutaEntrega, { name: 'createRutaEntrega' })
  async createRutaEntrega(@Args('input') input: CreateRutaEntregaInput): Promise<RutaEntrega> {
    const response = await lastValueFrom(this.httpService.post<RutaEntrega>(RUTA_ENTREGA_SERVICE_URL, input));
    return response.data;
  }

  @Mutation(() => RutaEntrega, { name: 'updateRutaEntrega' })
  async updateRutaEntrega(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateRutaEntregaInput,
  ): Promise<RutaEntrega> {
    const response = await lastValueFrom(this.httpService.patch<RutaEntrega>(`${RUTA_ENTREGA_SERVICE_URL}/${id}`, input));
    return response.data;
  }

  @Mutation(() => Boolean, { name: 'deleteRutaEntrega' })
  async deleteRutaEntrega(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${RUTA_ENTREGA_SERVICE_URL}/${id}`));
    return true;
  }

  // RESOLVE FIELD para RepartidorAsignado
  @ResolveField(() => Repartidor, { nullable: true })
  async repartidorAsignado(@Parent() rutaEntrega: RutaEntrega): Promise<Repartidor | null> {
    if (!rutaEntrega['repartidorId']) { // Asumiendo que tu REST API devuelve 'repartidorId'
      return null;
    }
    const response = await lastValueFrom(
      this.httpService.get<Repartidor>(`${REPARTIDOR_SERVICE_URL}/${(rutaEntrega as any).repartidorId}`)
    );
    return response.data;
  }
}