// api-gateway/src/producto/producto.module.ts
import { Module } from '@nestjs/common';
import { ProductoResolver } from './producto.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ProductoResolver],
  exports: [ProductoResolver]
})
export class ProductoModule {}