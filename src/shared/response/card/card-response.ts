import { ApiProperty } from '@nestjs/swagger';
import { BrandEnum } from '../../enum/brand.enum';

export class CardResponse {

  @ApiProperty({
    example: 5197504814138502,
  })
  cardNumber: number;

  @ApiProperty({
    example: '16/06/2023',
  })
  expirationDate: Date;

  @ApiProperty({
    example: 470,
  })
  securityCode: number;

  @ApiProperty({
    example: BrandEnum.MASTERCARD,
  })
  brand: string;

  
}
