import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repartidor } from './entities/repartidor.entity';
import { CreateRepartidorDto } from './dto/create-repartidor.dto';
import { UpdateRepartidorDto } from './dto/update-repartidor.dto';
import axios from 'axios'; // <--- Importa axios para hacer peticiones HTTP

@Injectable()
export class RepartidorService {
  private readonly logger = new Logger(RepartidorService.name); // <--- Instancia del Logger para mensajes en consola

  // URL del endpoint HTTP de tu servicio de notificaciones
  // ¡IMPORTANTE! Esta URL se debe configurar en una variable de entorno.
  // Asegúrate de que tu `modulo_ofertas` cargue variables de entorno (ej. con @nestjs/config).
  private readonly NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3011/send-notification'; // PUERTO ACTUALIZADO A 3011

  constructor(
    @InjectRepository(Repartidor)
    private readonly repartidorRepository: Repository<Repartidor>,
  ) {}

  async create(createRepartidorDto: CreateRepartidorDto): Promise<Repartidor> {
    const nuevoRepartidor = this.repartidorRepository.create(createRepartidorDto);
    const repartidorGuardado = await this.repartidorRepository.save(nuevoRepartidor);

    // --- Notificar al servicio de notificaciones después de crear ---
    // NOTA: Para el 'userId', aquí debes decidir a quién va la notificación.
    // Podría ser un ID de un administrador, o si el repartidor tiene una cuenta de usuario
    // asociada, ese ID. Para este ejemplo, usaré un placeholder 'admin_repartidores'.
    const userIdToNotify = repartidorGuardado.id ? `repartidor_admin_or_self_${repartidorGuardado.id}` : 'admin_repartidores'; 
    
    await this.sendNotification(
      userIdToNotify,
      `¡El repartidor '${repartidorGuardado.nombre || 'Nuevo Repartidor'}' (ID: ${repartidorGuardado.id}) ha sido registrado con éxito!`,
      'new_repartidor_registered',
      { repartidorId: repartidorGuardado.id, nombre: repartidorGuardado.nombre, email: repartidorGuardado.email } // Incluye datos que sí existen
    );

    return repartidorGuardado;
  }

  findAll(): Promise<Repartidor[]> {
    return this.repartidorRepository.find({
      relations: ['entregas', 'rutasEntrega'],
    });
  }

  async findOne(id: number): Promise<Repartidor> {
    const repartidor = await this.repartidorRepository.findOne({
      where: { id },
      relations: ['entregas', 'rutasEntrega'],
    });
    if (!repartidor) {
      throw new NotFoundException(`Repartidor con ID ${id} no encontrado.`);
    }
    return repartidor;
  }

  async update(
    id: number,
    updateRepartidorDto: UpdateRepartidorDto,
  ): Promise<Repartidor> {
    // No necesitamos el 'repartidorExistente' para comparar si 'disponible' no es una propiedad manejada aquí.
    // Solo necesitamos el ID para el preload.
    
    // `preload` crea una nueva instancia con los datos actualizados, si existe, basándose en el ID.
    const repartidorActualizado = await this.repartidorRepository.preload({
      id: id,
      ...updateRepartidorDto,
    });
    
    if (!repartidorActualizado) { 
      throw new NotFoundException(`Repartidor con ID ${id} no encontrado.`); 
    }

    const repartidorGuardado = await this.repartidorRepository.save(repartidorActualizado);

    // --- Notificar al servicio de notificaciones después de actualizar ---
    // Decide a quién notificar (ej. al propio repartidor si tiene un userId asociado, o a un admin).
    const userIdToNotify = repartidorGuardado.id ? `repartidor_admin_or_self_${repartidorGuardado.id}` : 'admin_repartidores'; 

    let message = `El repartidor '${repartidorGuardado.nombre || repartidorGuardado.id}' ha sido actualizado.`;
    const data = { repartidorId: repartidorGuardado.id, ...updateRepartidorDto }; // Envía todos los datos actualizados
    let notificationType = 'repartidor_updated';
    
    // ELIMINADA la lógica específica para 'disponible' para evitar el error.
    // Si más adelante añades propiedades de estado en tu entidad, puedes añadir lógica similar aquí.
    
    await this.sendNotification(
      userIdToNotify,
      message,
      notificationType,
      data
    );

    return repartidorGuardado;
  }

  async remove(id: number): Promise<void> {
    const result = await this.repartidorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Repartidor con ID ${id} no encontrado.`);
    }
    // Opcional: Notificar que un repartidor ha sido eliminado
    await this.sendNotification(
      'admin_repartidores', // Notificar a un usuario administrador
      `El repartidor con ID ${id} ha sido eliminado del sistema.`,
      'repartidor_deleted',
      { repartidorId: id }
    );
  }

  // --- Método privado para encapsular la lógica de envío de notificación ---
  // Este método hace la petición HTTP POST al servicio de notificaciones.
  private async sendNotification(
    userId: string, // El ID del usuario final que recibirá la notificación vía WebSocket
    message: string, // El mensaje principal de la notificación
    type: string,    // El tipo de evento (ej. 'new_repartidor_registered', 'order_status_update')
    data: any = {}   // Datos adicionales relevantes para la notificación
  ): Promise<void> {
    try {
      await axios.post(this.NOTIFICATION_SERVICE_URL, {
        user_id: userId,
        message: message,
        type: type,
        data: data
      });
      this.logger.log(`Notificación enviada con éxito para usuario ${userId} (desde RepartidorService).`);
    } catch (error) {
      // Manejo de errores para la petición de notificación. Es importante que esto no detenga la operación principal.
      this.logger.error(`Error al enviar notificación al servicio de notificaciones (desde RepartidorService):`);
      if (axios.isAxiosError(error)) { // Verifica si es un error de Axios
        this.logger.error(`  Mensaje: ${error.message}`);
        if (error.response) {
          // El servidor respondió con un status diferente de 2xx
          this.logger.error(`  Respuesta del servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta (ej. red caída)
          this.logger.error(`  No se recibió respuesta del servicio de notificaciones. Request: ${error.request}`);
        } else {
          // Algo más ocurrió al configurar la petición
          this.logger.error(`  Error de configuración de Axios: ${error.message}`);
        }
      } else {
        // Otro tipo de error
        this.logger.error(`  Error inesperado: ${error}`);
      }
    }
  }
}