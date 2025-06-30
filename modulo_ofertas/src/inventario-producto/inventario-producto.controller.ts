import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventarioProductoService } from './inventario-producto.service';
import { CreateInventarioProductoDto } from './dto/create-inventario-producto.dto';
import { UpdateInventarioProductoDto } from './dto/update-inventario-producto.dto';

@Controller('inventario-producto')
export class InventarioProductoController {
  constructor(private readonly inventarioProductoService: InventarioProductoService) {}

  @Post()
  create(@Body() createInventarioProductoDto: CreateInventarioProductoDto) {
    return this.inventarioProductoService.create(createInventarioProductoDto);
  }

  @Get()
  findAll() {
    return this.inventarioProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioProductoDto: UpdateInventarioProductoDto) {
    return this.inventarioProductoService.update(+id, updateInventarioProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventarioProductoService.remove(+id);
  }
}
