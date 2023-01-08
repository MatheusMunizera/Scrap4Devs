import { ApiProperty } from '@nestjs/swagger';
import { DriverLicenseResponse } from './driver-license.response';
import { VehicleResponse } from './vehicle.response';

export class DriverResponse {
  @ApiProperty()
  driverLicense: DriverLicenseResponse;

  @ApiProperty()
  vehicle: VehicleResponse;

  constructor(driverLicense: DriverLicenseResponse, vehicle: VehicleResponse) {
    this.driverLicense = driverLicense;
    this.vehicle = vehicle;
  }
}
