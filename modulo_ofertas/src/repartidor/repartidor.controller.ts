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
import { RepartidorService } from './repartidor.service';
import { CreateRepartidorDto } from './dto/create-repartidor.dto';
import { UpdateRepartidorDto } from './dto/update-repartidor.dto';
import { Repartidor } from './entities/repartidor.entity';

@Controller('repartidores')
export class RepartidorController {
  constructor(private readonly repartidorService: RepartidorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createRepartidorDto: CreateRepartidorDto,
  ): Promise<Repartidor> {
    return this.repartidorService.create(createRepartidorDto);
  }

  @Get()
  findAll(): Promise<Repartidor[]> {
    return this.repartidorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Repartidor> {
    return this.repartidorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateRepartidorDto: UpdateRepartidorDto,
  ): Promise<Repartidor> {
    return this.repartidorService.update(id, updateRepartidorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.repartidorService.remove(id);
  }
}