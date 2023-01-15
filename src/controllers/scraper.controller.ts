import {
  Param,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ScraperService } from '../services/scraper.service';
import { PersonResponse } from '../shared/response/person/person.response';
import { BrandEnum } from '../shared/enum/brand.enum';
import { CardResponse } from '../shared/response/card/card.response';
import { DriverResponse } from '../shared/response/driver/driver.response';
import { BankEnum } from '../shared/enum/bank.enum';
import { ApiErrorResponses } from '../helpers/swagger/error-response.swagger';


@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private scrapperService: ScraperService) { }

  @Get('generate/person')
  @ApiResponse({
    status: 200,
    description: 'PPerson generated successfully. Your new person profile including all the personal information is ready for use.',
    type: PersonResponse,
  })
  @ApiErrorResponses()
  async generatePerson(): Promise<PersonResponse> {
    const person =  await this.scrapperService.getPerson();
    if(!person)
      throw new HttpException('No Content has been generated', HttpStatus.NO_CONTENT);
      
     return person;
    
  }

  @Get('generate/card')
  @ApiResponse({
    status: 200,
    description: 'Credit card generated successfully. Your new credit card is ready for use',
    type: CardResponse,
  })
  @ApiErrorResponses()
  @ApiQuery({ name: 'brand', enum: BrandEnum, required: true })
  @ApiQuery({ name: 'bank', enum: BankEnum, required: true })
  async generateCard(@Query('brand') brand: BrandEnum,@Query('bank') bank: BankEnum): Promise<CardResponse> {
     const card=  await this.scrapperService.getCard(brand, bank);
 
    if(!card)
     throw new HttpException('No Content has been generated', HttpStatus.NO_CONTENT);
      
    return card;
 
  }

  @Get('generate/driver')
  @ApiResponse({
    status: 200,
    description: 'Driver generated successfully. Your new driver profile including their license and car information is ready for use.',
    type: DriverResponse
  })
  @ApiErrorResponses()
  async generateDriver(): Promise<DriverResponse> {
    const driver=  await this.scrapperService.getDriver();
    if(!driver)
      throw new HttpException('No Content has been generated', HttpStatus.NO_CONTENT);
      
    return driver;
  }
}

