// api-gateway/src/usuario/usuario.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';

// ¡ACTUALIZA ESTA URL CON EL PUERTO Y RUTA REAL DE TU MODULO_PEDIDOS!
const USUARIO_SERVICE_URL = 'http://localhost:3004/usuarios'; // Asegúrate de que este puerto sea correcto para tu backend Python

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private readonly httpService: HttpService) {}

  // --- QUERIES ---

  @Query(() => [Usuario], { name: 'usuarios' })
  async findAllUsuarios(): Promise<Usuario[]> {
    const response = await lastValueFrom(this.httpService.get<Usuario[]>(USUARIO_SERVICE_URL));
    return response.data.map(this.mapUsuarioFromBackend);
  }

  @Query(() => Usuario, { name: 'usuario' })
  async findOneUsuario(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Usuario> {
    const response = await lastValueFrom(this.httpService.get<Usuario>(`${USUARIO_SERVICE_URL}/${id}`));
    return this.mapUsuarioFromBackend(response.data);
  }

  // --- MUTATIONS ---

  @Mutation(() => Usuario, { name: 'createUsuario' })
  async createUsuario(
    @Args('input') input: CreateUsuarioInput,
  ): Promise<Usuario> {
    const payload = {
      nombre: input.nombre,
      email: input.email,
      // *** CAMBIO CRÍTICO AQUÍ: El backend espera 'password', no 'hashed_password' en el input ***
      password: input.password, // Correcto: envía 'password' al backend
      direccion: input.direccion,
      telefono: input.telefono,
    };
    const response = await lastValueFrom(this.httpService.post<Usuario>(USUARIO_SERVICE_URL, payload));
    return this.mapUsuarioFromBackend(response.data);
  }

  @Mutation(() => Usuario, { name: 'updateUsuario' })
  async updateUsuario(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateUsuarioInput,
  ): Promise<Usuario> {
    const payload: any = {};
    if (input.nombre !== undefined) payload.nombre = input.nombre;
    if (input.email !== undefined) payload.email = input.email;
    if (input.direccion !== undefined) payload.direccion = input.direccion;
    if (input.telefono !== undefined) payload.telefono = input.telefono;
    // *** CAMBIO CRÍTICO AQUÍ: El backend espera 'password' para actualizar, no 'hashed_password' ***
    if (input.password !== undefined) payload.password = input.password; // Correcto: envía 'password' al backend

    const response = await lastValueFrom(this.httpService.patch<Usuario>(`${USUARIO_SERVICE_URL}/${id}`, payload));
    return this.mapUsuarioFromBackend(response.data);
  }

  @Mutation(() => Boolean, { name: 'deleteUsuario' })
  async deleteUsuario(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${USUARIO_SERVICE_URL}/${id}`));
    return true;
  }

  // Función de mapeo auxiliar
  private mapUsuarioFromBackend(data: any): Usuario {
    // Asegúrate de que los campos del backend se mapeen correctamente a camelCase si es necesario
    return {
      ...data,
      // Si tu backend devuelve 'fecha_creacion' y 'fecha_actualizacion' en snake_case
      // y quieres mapearlos a createdAt/updatedAt:
      createdAt: data.fecha_creacion ? new Date(data.fecha_creacion) : new Date(),
      updatedAt: data.fecha_actualizacion ? new Date(data.fecha_actualizacion) : new Date(),
    };
  }
}