import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PersonDto } from '../shared/dtos/person/person.dto';
import { NotFoundSwagger } from '../helpers/swagger/not-found.swagger';
import { ScraperService } from '../services/scraper.service';
import { PersonResponseDto } from '../shared/dtos/person/person-response.dto';
import { NoContentSwagger } from '../helpers/swagger/no-content.swagger';


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
  async scraperController(): Promise<PersonResponseDto> {
    const person =  await this.scrapperService.getPerson();
    if(person == null)
      throw new HttpException('Cannot generate a person, try again.', HttpStatus.NO_CONTENT);
      
    return person;
  }
}

