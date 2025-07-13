import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Entrega } from './entities/entrega.entity';
import { CreateEntregaInput } from './dto/create-entrega.input';
import { UpdateEntregaInput } from './dto/update-entrega.input'; 

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Repartidor } from '../repartidor/entities/repartidor.entity';
import { RutaEntrega } from '../ruta-entrega/entities/ruta-entrega.entity';
import { OfertaReducida } from '../oferta-reducida/entities/oferta-reducida.entity';

const ENTREGA_SERVICE_URL = 'http://localhost:3000/entregas'; // ¡Asegura que esta URL sea correcta!
const REPARTIDOR_SERVICE_URL = 'http://localhost:3000/repartidores';
const RUTA_ENTREGA_SERVICE_URL = 'http://localhost:3000/rutas-entrega';
const OFERTA_REDUCIDA_SERVICE_URL = 'http://localhost:3000/ofertas-reducidas';

@Resolver(() => Entrega)
export class EntregaResolver {
  constructor(private readonly httpService: HttpService) {}

  @Query(() => [Entrega], { name: 'entregas' })
  async findAllEntregas(): Promise<Entrega[]> {
    const response = await lastValueFrom(this.httpService.get<Entrega[]>(ENTREGA_SERVICE_URL));
    return response.data;
  }

  @Query(() => Entrega, { name: 'entrega' })
  async findOneEntrega(@Args('id', { type: () => ID }) id: number): Promise<Entrega> {
    const response = await lastValueFrom(this.httpService.get<Entrega>(`${ENTREGA_SERVICE_URL}/${id}`));
    return response.data;
  }

  @Mutation(() => Entrega, { name: 'createEntrega' })
  async createEntrega(@Args('input') input: CreateEntregaInput): Promise<Entrega> {
    const response = await lastValueFrom(this.httpService.post<Entrega>(ENTREGA_SERVICE_URL, input));
    return response.data;
  }

  @Mutation(() => Entrega, { name: 'updateEntrega' })
  async updateEntrega(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateEntregaInput,
  ): Promise<Entrega> {
    const response = await lastValueFrom(this.httpService.patch<Entrega>(`${ENTREGA_SERVICE_URL}/${id}`, input));
    return response.data;
  }

  @Mutation(() => Boolean, { name: 'deleteEntrega' })
  async deleteEntrega(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${ENTREGA_SERVICE_URL}/${id}`));
    return true;
  }

  // RESOLVE FIELD para Repartidor
  @ResolveField(() => Repartidor, { nullable: true })
  async repartidor(@Parent() entrega: Entrega): Promise<Repartidor | null> {
    if (!entrega['repartidorId']) {
      return null;
    }
    const response = await lastValueFrom(
      this.httpService.get<Repartidor>(`${REPARTIDOR_SERVICE_URL}/${(entrega as any).repartidorId}`)
    );
    return response.data;
  }

  // RESOLVE FIELD para RutaEntrega
  @ResolveField(() => RutaEntrega, { nullable: true })
  async rutaEntrega(@Parent() entrega: Entrega): Promise<RutaEntrega | null> {
    if (!entrega['rutaEntregaId']) {
      return null;
    }
    const response = await lastValueFrom(
      this.httpService.get<RutaEntrega>(`${RUTA_ENTREGA_SERVICE_URL}/${(entrega as any).rutaEntregaId}`)
    );
    return response.data;
  }

  // RESOLVE FIELD para OfertaReducida (usando ofertaReducidaId de la Entrega)
  @ResolveField(() => OfertaReducida, { nullable: true })
  async ofertaReducida(@Parent() entrega: Entrega): Promise<OfertaReducida | null> {
    if (!entrega['ofertaReducidaId']) {
      return null;
    }
    const response = await lastValueFrom(
      this.httpService.get<OfertaReducida>(`${OFERTA_REDUCIDA_SERVICE_URL}/${(entrega as any).ofertaReducidaId}`)
    );
    return response.data;
  }
}