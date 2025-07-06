import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { InventarioProductoService } from './inventario-producto.service';
import { CreateInventarioProductoDto } from './dto/create-inventario-producto.dto';
import { UpdateInventarioProductoDto } from './dto/update-inventario-producto.dto';
import { InventarioProducto } from './entities/inventario-producto.entity';

@Controller('inventario-productos')
export class InventarioProductoController {
  constructor(
    private readonly inventarioProductoService: InventarioProductoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createInventarioProductoDto: CreateInventarioProductoDto,
  ): Promise<InventarioProducto> {
    return this.inventarioProductoService.create(createInventarioProductoDto);
  }

  @Get()
  findAll(): Promise<InventarioProducto[]> {
    return this.inventarioProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<InventarioProducto> {
    return this.inventarioProductoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateInventarioProductoDto: UpdateInventarioProductoDto,
  ): Promise<InventarioProducto> {
    return this.inventarioProductoService.update(
      id,
      updateInventarioProductoDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.inventarioProductoService.remove(id);
  }
}