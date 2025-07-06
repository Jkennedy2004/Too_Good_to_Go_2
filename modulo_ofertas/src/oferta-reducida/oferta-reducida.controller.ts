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
import { OfertaReducidaService } from './oferta-reducida.service';
import { CreateOfertaReducidaDto } from './dto/create-oferta-reducida.dto';
import { UpdateOfertaReducidaDto } from './dto/update-oferta-reducida.dto';
import { OfertaReducida } from './entities/oferta-reducida.entity';

@Controller('ofertas-reducidas')
export class OfertaReducidaController {
  constructor(private readonly ofertaReducidaService: OfertaReducidaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createOfertaReducidaDto: CreateOfertaReducidaDto,
  ): Promise<OfertaReducida> {
    return this.ofertaReducidaService.create(createOfertaReducidaDto);
  }

  @Get()
  findAll(): Promise<OfertaReducida[]> {
    return this.ofertaReducidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OfertaReducida> {
    return this.ofertaReducidaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateOfertaReducidaDto: UpdateOfertaReducidaDto,
  ): Promise<OfertaReducida> {
    return this.ofertaReducidaService.update(id, updateOfertaReducidaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ofertaReducidaService.remove(id);
  }
}