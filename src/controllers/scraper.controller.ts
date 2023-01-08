import {
  Param,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NotFoundSwagger } from '../helpers/swagger/not-found.swagger';
import { ScraperService } from '../services/scraper.service';
import { PersonResponse } from '../shared/response/person/person.response';
import { NoContentSwagger } from '../helpers/swagger/no-content.swagger';
import { BrandEnum } from '../shared/enum/brand.enum';
import { CardResponse } from '../shared/response/card/card.response';
import { DriverResponse } from '../shared/response/driver/driver.response';


@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private scrapperService: ScraperService) { }

  @Get('generate/person')
  @ApiResponse({
    status: 200,
    description: 'Person generated',
    type: PersonResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Error generating person',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 204,
    description: 'Cannot generate a person',
    type: NoContentSwagger,
  })
  async generatePerson(): Promise<PersonResponse> {
    const person =  await this.scrapperService.getPerson();
    if(person == null)
      throw new HttpException('Cannot generate a person, try again.', HttpStatus.NO_CONTENT);
      
    return person;
  }

  @Get('generate/card')
  @ApiResponse({
    status: 200,
    description: 'Card generated',
    type: CardResponse
  })
  @ApiResponse({
    status: 404,
    description: 'Error generating card',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 204,
    description: 'Cannot generate a card',
    type: NoContentSwagger,
  })
  @ApiQuery({ name: 'brand', enum: BrandEnum, required: true })
  async generateCard(@Query('brand') brand: BrandEnum): Promise<CardResponse> {
    const card=  await this.scrapperService.getCard(brand);
    if(card == null)
      throw new HttpException('Cannot generate a person, try again.', HttpStatus.NO_CONTENT);
      
    return card;
  }

  @Get('generate/driver')
  @ApiResponse({
    status: 200,
    description: 'Driver generated',
    type: DriverResponse
  })
  @ApiResponse({
    status: 404,
    description: 'Error generating driver',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 204,
    description: 'Cannot generate a driver',
    type: NoContentSwagger,
  })
  async generateDriver(): Promise<DriverResponse> {
    const driver=  await this.scrapperService.getDriver();
    if(driver == null)
      throw new HttpException('Cannot generate a person, try again.', HttpStatus.NO_CONTENT);
      
    return driver;
  }
}

