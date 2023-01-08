import { Mapper } from '../../../base/mapper';
import { PersonEntity } from '../../entities/person.entity';
import { PersonResponse } from '../../../../shared/response/person/person.response';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { VehicleResponse } from '../../../../shared/response/driver/vehicle.response';

export class VehicleResponseMapper
  implements Mapper<VehicleResponse, VehicleEntity>
{
  public mapFrom(response: VehicleResponse):VehicleEntity {
    const entity = new VehicleEntity();
    
    entity.marca = response.brand;
    entity.modelo = response.model;
    entity.ano = response.year;
    entity.cor = response.color;
    entity.renavam = `${response.reindeer}`;
    entity.placa = response.licensePlate;

    return entity;

  }

  public mapTo(vehicle: VehicleEntity): VehicleResponse {

    const response = new VehicleResponse();
    
    response.brand = vehicle.marca;
    response.model = vehicle.modelo;
    response.year = vehicle.ano;
    response.color = vehicle.cor;
    response.reindeer = +vehicle.renavam;
    response.licensePlate = vehicle.placa;

    return response;

  }
}
