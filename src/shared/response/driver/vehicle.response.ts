import { ApiProperty } from '@nestjs/swagger';

export class VehicleResponse {

    @ApiProperty({
        example: 'Jaguar',
      })
      brand: string;
    
      @ApiProperty({
        example: 'XJ-12',
      })
      model: string;

      @ApiProperty({
        example: '1993',
      })
      year: string;
      
      @ApiProperty({
        example: 47670162406,
      })
      reindeer: number;

      @ApiProperty({
        example: 'JZA-5981',
      })
      licensePlate: string;

      @ApiProperty({
        example: 'Amarelo',
      })
      color: string;
  
}
