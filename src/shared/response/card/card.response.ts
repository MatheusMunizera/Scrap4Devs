import { ApiProperty } from '@nestjs/swagger';
import { BankAccountEntity } from '../../../core/domain/entities/bank-account.entity';
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
    example: BrandEnum.Mastercard,
  })
  brand: string;
  @ApiProperty({
    example: '19726-6',
  })
  checkingAccount: string;
  @ApiProperty({
    example: '0680',
  })
  bankAgency: string;
  @ApiProperty({
    example: 'Itau',
  })
  bank: string;

  fillBankAccount(bank : BankAccountEntity){
    this.checkingAccount = bank.contaCorrente;
    this.bankAgency = bank.agencia;
    this.bank = bank.banco;
  }
}
