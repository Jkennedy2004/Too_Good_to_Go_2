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
import { RutaEntregaService } from './ruta-entrega.service';
import { CreateRutaEntregaDto } from './dto/create-ruta-entrega.dto';
import { UpdateRutaEntregaDto } from './dto/update-ruta-entrega.dto';
import { RutaEntrega } from './entities/ruta-entrega.entity';

@Controller('rutas-entrega')
export class RutaEntregaController {
  constructor(private readonly rutaEntregaService: RutaEntregaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createRutaEntregaDto: CreateRutaEntregaDto,
  ): Promise<RutaEntrega> {
    return this.rutaEntregaService.create(createRutaEntregaDto);
  }

  @Get()
  findAll(): Promise<RutaEntrega[]> {
    return this.rutaEntregaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RutaEntrega> {
    return this.rutaEntregaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateRutaEntregaDto: UpdateRutaEntregaDto,
  ): Promise<RutaEntrega> {
    return this.rutaEntregaService.update(id, updateRutaEntregaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rutaEntregaService.remove(id);
  }
}