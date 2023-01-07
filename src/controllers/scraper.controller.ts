import {
  Param,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PersonDto } from '../shared/dtos/person/person.dto';
import { NotFoundSwagger } from '../helpers/swagger/not-found.swagger';
import { ScraperService } from '../services/scraper.service';
import { PersonResponseDto } from '../shared/dtos/person/person-response.dto';
import { NoContentSwagger } from '../helpers/swagger/no-content.swagger';
import { BrandEnum } from '../shared/enum/brand.enum';
import { CardResponse } from '../shared/dtos/card/card-response';


@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private scrapperService: ScraperService) { }

  @Get('generate/person')
  @ApiResponse({
    status: 200,
    description: 'Person generated',
    type: [PersonResponseDto],
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
  async generatePerson(): Promise<PersonResponseDto> {
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
}

