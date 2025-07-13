// api-gateway/src/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { UsuarioResolver } from './usuario.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [UsuarioResolver],
  exports: [UsuarioResolver]
})
export class UsuarioModule {}