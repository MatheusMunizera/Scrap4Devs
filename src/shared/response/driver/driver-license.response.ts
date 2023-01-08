import { ApiProperty } from '@nestjs/swagger';
import { CnhEntity } from '../../../core/domain/entities/cnh.entity';
import { PersonResponse } from '../person/person.response';

export class DriverLicenseResponse {

    @ApiProperty({
        example: 'Matheus Muniz Dantas',
      })
      name: string;
    
      @ApiProperty({
        example: '01/05/2031',
      })
      expirationDate: Date;

      @ApiProperty({
        example: '01/05/2001',
      })
      birthdate: Date;
      
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
        example: 'A',
      })
      category: string; 
      
      @ApiProperty({
        example: 60181210,
      })
      registerNumber: number;
      @ApiProperty({
        example: '01/05/2001',
      })
      firstLicense: Date;


      public fillPersonAndCnhData(person: PersonResponse, cnh: CnhEntity) {
        this.name = person.name;
        this.birthdate = person.birthdate;
        this.cpf = person.cpf;
        this.rg = person.rg;
        this.father = person.father;
        this.mother = person.mother;
        this.category = this.randomCategory();
        this.registerNumber = +cnh.numeroRegistro;
        this.firstLicense = this.randomDateSinceDateUntilNow(this.addYears(this.birthdate,18));
        this.expirationDate = this.randomDateSinceDateUntilNow(this.addYears(this.firstLicense,5));
      }

      private randomCategory() {
        const categories = ['A', 'B', 'C', 'D', 'E', 'AB'];
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
      }

      private randomDateSinceDateUntilNow(date: Date) {
        const start = date;
        const end = new Date();
        return new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime()),
        );
      }

      private addYears(date: Date,  years: number) {
        const newDate = new Date(date);
        newDate.setFullYear(newDate.getFullYear() + years);
        return newDate;
      }
      
      
}
