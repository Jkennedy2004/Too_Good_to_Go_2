import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfertaReducidaService } from './oferta-reducida.service';
import { CreateOfertaReducidaDto } from './dto/create-oferta-reducida.dto';
import { UpdateOfertaReducidaDto } from './dto/update-oferta-reducida.dto';

@Controller('oferta-reducida')
export class OfertaReducidaController {
  constructor(private readonly ofertaReducidaService: OfertaReducidaService) {}

  @Post()
  create(@Body() createOfertaReducidaDto: CreateOfertaReducidaDto) {
    return this.ofertaReducidaService.create(createOfertaReducidaDto);
  }

  @Get()
  findAll() {
    return this.ofertaReducidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofertaReducidaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfertaReducidaDto: UpdateOfertaReducidaDto) {
    return this.ofertaReducidaService.update(+id, updateOfertaReducidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofertaReducidaService.remove(+id);
  }
}
