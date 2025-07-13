import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { InventarioProducto } from './entities/inventario-producto.entity';
import { CreateInventarioProductoInput } from './dto/create-inventario-producto.input';
import { UpdateInventarioProductoInput } from './dto/update-inventario-producto.input'; 

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { OfertaReducida } from '../oferta-reducida/entities/oferta-reducida.entity';

const INVENTARIO_PRODUCTO_SERVICE_URL = 'http://localhost:3000/inventario-productos';
const OFERTA_REDUCIDA_SERVICE_URL = 'http://localhost:3000/ofertas-reducidas';

@Resolver(() => InventarioProducto)
export class InventarioProductoResolver {
  constructor(private readonly httpService: HttpService) {}

  @Query(() => [InventarioProducto], { name: 'inventarioProductos' })
  async findAllInventarioProductos(): Promise<InventarioProducto[]> {
    const response = await lastValueFrom(this.httpService.get<InventarioProducto[]>(INVENTARIO_PRODUCTO_SERVICE_URL));
    return response.data;
  }

  @Query(() => InventarioProducto, { name: 'inventarioProducto' })
  async findOneInventarioProducto(@Args('id', { type: () => ID }) id: number): Promise<InventarioProducto> {
    const response = await lastValueFrom(this.httpService.get<InventarioProducto>(`${INVENTARIO_PRODUCTO_SERVICE_URL}/${id}`));
    return response.data;
  }

  @Mutation(() => InventarioProducto, { name: 'createInventarioProducto' })
  async createInventarioProducto(@Args('input') input: CreateInventarioProductoInput): Promise<InventarioProducto> {
    const response = await lastValueFrom(this.httpService.post<InventarioProducto>(INVENTARIO_PRODUCTO_SERVICE_URL, input));
    return response.data;
  }

  @Mutation(() => InventarioProducto, { name: 'updateInventarioProducto' })
  async updateInventarioProducto(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateInventarioProductoInput,
  ): Promise<InventarioProducto> {
    const response = await lastValueFrom(this.httpService.patch<InventarioProducto>(`${INVENTARIO_PRODUCTO_SERVICE_URL}/${id}`, input));
    return response.data;
  }

  @Mutation(() => Boolean, { name: 'deleteInventarioProducto' })
  async deleteInventarioProducto(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${INVENTARIO_PRODUCTO_SERVICE_URL}/${id}`));
    return true;
  }

  @ResolveField(() => [OfertaReducida], { nullable: true })
  async ofertasReducidas(@Parent() inventarioProducto: InventarioProducto): Promise<OfertaReducida[]> {
    const response = await lastValueFrom(
      this.httpService.get<OfertaReducida[]>(`${OFERTA_REDUCIDA_SERVICE_URL}?inventarioProductoId=${inventarioProducto.id}`)
    );
    return response.data;
  }
}