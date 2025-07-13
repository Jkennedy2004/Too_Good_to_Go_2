import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { OfertaReducida } from './entities/oferta-reducida.entity';
import { CreateOfertaReducidaInput } from './dto/create-oferta-reducida.input';
import { UpdateOfertaReducidaInput } from './dto/update-oferta-reducida.input'; 

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InventarioProducto } from '../inventario-producto/entities/inventario-producto.entity';
import { Entrega } from '../entrega/entities/entrega.entity';

const OFERTA_REDUCIDA_SERVICE_URL = 'http://localhost:3000/ofertas-reducidas'; // ¡Asegura que esta URL sea correcta!
const INVENTARIO_PRODUCTO_SERVICE_URL = 'http://localhost:3000/inventario-productos';
const ENTREGA_SERVICE_URL = 'http://localhost:3000/entregas'; // Asumiendo que Entrega tiene un endpoint

@Resolver(() => OfertaReducida)
export class OfertaReducidaResolver {
  constructor(private readonly httpService: HttpService) {}

  @Query(() => [OfertaReducida], { name: 'ofertasReducidas' })
  async findAllOfertasReducidas(): Promise<OfertaReducida[]> {
    const response = await lastValueFrom(this.httpService.get<OfertaReducida[]>(OFERTA_REDUCIDA_SERVICE_URL));
    return response.data;
  }

  @Query(() => OfertaReducida, { name: 'ofertaReducida' })
  async findOneOfertaReducida(@Args('id', { type: () => ID }) id: number): Promise<OfertaReducida> {
    const response = await lastValueFrom(this.httpService.get<OfertaReducida>(`${OFERTA_REDUCIDA_SERVICE_URL}/${id}`));
    return response.data;
  }

  @Mutation(() => OfertaReducida, { name: 'createOfertaReducida' })
  async createOfertaReducida(@Args('input') input: CreateOfertaReducidaInput): Promise<OfertaReducida> {
    const response = await lastValueFrom(this.httpService.post<OfertaReducida>(OFERTA_REDUCIDA_SERVICE_URL, input));
    return response.data;
  }

  @Mutation(() => OfertaReducida, { name: 'updateOfertaReducida' })
  async updateOfertaReducida(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateOfertaReducidaInput,
  ): Promise<OfertaReducida> {
    const response = await lastValueFrom(this.httpService.patch<OfertaReducida>(`${OFERTA_REDUCIDA_SERVICE_URL}/${id}`, input));
    return response.data;
  }

  @Mutation(() => Boolean, { name: 'deleteOfertaReducida' })
  async deleteOfertaReducida(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${OFERTA_REDUCIDA_SERVICE_URL}/${id}`));
    return true;
  }

  // RESOLVE FIELD para InventarioProducto
  @ResolveField(() => InventarioProducto)
  async inventarioProducto(@Parent() ofertaReducida: OfertaReducida): Promise<InventarioProducto> {
    // La entidad OfertaReducida de tu microservicio REST debería tener un campo `inventarioProductoId`
    const response = await lastValueFrom(
      this.httpService.get<InventarioProducto>(`${INVENTARIO_PRODUCTO_SERVICE_URL}/${(ofertaReducida as any).inventarioProductoId}`)
    );
    return response.data;
  }

  // RESOLVE FIELD para Entrega (si una OfertaReducida tiene una Entrega asociada)
  // Dada tu entidad Entrega, la FK ofertaReducidaId está en Entrega.
  // Por lo tanto, para encontrar la Entrega desde una OfertaReducida, tendrías que buscar en el servicio de Entregas.
  @ResolveField(() => Entrega, { nullable: true })
  async entrega(@Parent() ofertaReducida: OfertaReducida): Promise<Entrega | null> {
    // Busca si existe una entrega donde ofertaReducidaId coincida con el ID de esta oferta reducida.
    // Asumiendo que tu servicio de Entregas tiene un endpoint para buscar por ofertaReducidaId.
    // Ejemplo: GET /entregas?ofertaReducidaId=XYZ
    try {
      const response = await lastValueFrom(
        this.httpService.get<Entrega[]>(`${ENTREGA_SERVICE_URL}?ofertaReducidaId=${ofertaReducida.id}`)
      );
      // Retorna la primera entrega encontrada o null si no hay ninguna
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      // Manejo de errores si el endpoint no existe o falla
      console.error(`Error fetching Entrega for OfertaReducida ${ofertaReducida.id}:`, error.message);
      return null;
    }
  }
}