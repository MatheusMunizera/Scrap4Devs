import { ApiProperty } from '@nestjs/swagger';

export class PersonResponseDto {

 
 
  constructor() {      
  }


  @ApiProperty({
    example: 'Matheus Muniz Dantas',
  })
  name: string;

  @ApiProperty({
    example: '01/05/2001',
  })
  birthdate: Date;

  @ApiProperty({
    example: 21,
  })
  age: number;

  @ApiProperty({
    example: 'MALE',
  })
  gender: string;

  @ApiProperty({
    example: 'Touro',
  })
  sign: string;
  @ApiProperty({
    example: 19497567340,
  })
  cpf: number;
  @ApiProperty({
    example: '27058665X',
  })
  rg: string;
  @ApiProperty({
    example: 'Daniel Alexandre Lorenzo da Mota',
  })
  father: string;
  @ApiProperty({
    example: 'Antônia Camila',
  })
  mother: string;
  @ApiProperty({
    example: 'matheus.munizera@gmail.com',
  })
  email: string;
  @ApiProperty({
    example: '60181210',
  })
  cep: string;
  @ApiProperty({
    example: 'Rua Ponta Mar',
  })
  address: string;
  @ApiProperty({
    example: 113,
  })
  number: string;
  @ApiProperty({
    example: 'Vicente Pinzon',
  })
  district: string;
  @ApiProperty({
    example: 'Fortaleza',
  })
  city: string;
  @ApiProperty({
    example: 85983187119,
  })
  phone: number;
  @ApiProperty({
    example: '1,82',
  })
  height: string;
  @ApiProperty({
    example: 86,
  })
  weight: number;
  @ApiProperty({
    example: 'A+'
  })
  blood: string;
  @ApiProperty({
    example: 'vermelho',
  })
  color: string;
}
