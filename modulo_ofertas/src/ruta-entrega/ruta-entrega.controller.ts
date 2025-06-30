import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RutaEntregaService } from './ruta-entrega.service';
import { CreateRutaEntregaDto } from './dto/create-ruta-entrega.dto';
import { UpdateRutaEntregaDto } from './dto/update-ruta-entrega.dto';

@Controller('ruta-entrega')
export class RutaEntregaController {
  constructor(private readonly rutaEntregaService: RutaEntregaService) {}

  @Post()
  create(@Body() createRutaEntregaDto: CreateRutaEntregaDto) {
    return this.rutaEntregaService.create(createRutaEntregaDto);
  }

  @Get()
  findAll() {
    return this.rutaEntregaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutaEntregaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRutaEntregaDto: UpdateRutaEntregaDto) {
    return this.rutaEntregaService.update(+id, updateRutaEntregaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutaEntregaService.remove(+id);
  }
}
