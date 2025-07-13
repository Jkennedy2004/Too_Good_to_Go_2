// api-gateway/src/restaurante/restaurante.module.ts
import { Module } from '@nestjs/common';
import { RestauranteResolver } from './restaurante.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [RestauranteResolver],
  exports: [RestauranteResolver]
})
export class RestauranteModule {}