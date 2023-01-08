import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CardEntity } from '../core/domain/entities/card.entity';
import { PersonEntity } from '../core/domain/entities/person.entity';
import { CardResponseMapper } from '../core/domain/mappers/card/card-response.mapper';
import { PersonResponseMapper } from '../core/domain/mappers/person/person-response.mapper';
import { CardResponse } from '../shared/response/card/card.response';
import { PersonResponse } from '../shared/response/person/person.response';
import { BrandEnum } from '../shared/enum/brand.enum';
import { DriverLicenseResponse } from '../shared/response/driver/driver-license.response';
import { DriverResponse } from '../shared/response/driver/driver.response';
import { CnhEntity } from '../core/domain/entities/cnh.entity';
import { VehicleResponse } from '../shared/response/driver/vehicle.response';
import { VehicleEntity } from '../core/domain/entities/vehicle.entity';
import { VehicleResponseMapper } from '../core/domain/mappers/vehicle/vehicle-response.mapper';

@Injectable()
export class ScraperService {
  @Inject(ConfigService)
  public baseUrl: string = process.env.BASE_URL_4DEVS;
  public config: ConfigService;

  constructor() {}

  //#region Private Methods

  private async defineChromePuppeterOptions() {
    let chrome: any = {};
    let puppeteer;

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      chrome = require('chrome-aws-lambda');
      puppeteer = require('puppeteer-core');
    } else {
      puppeteer = require('puppeteer');
    }

    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      options = {
        args: [
          ...chrome.args,
          '--hide-scrollbars',
          '--disable-web-security',
          '--no-sandbox',
        ],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      };
    }

    return { chrome, puppeteer, options };
  }

  private async generateCard(brand: BrandEnum, page: any) {
    const generateCard = `gerar_cc('${brand}')`;
    await page.addScriptTag({ content: generateCard });

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const data = await page.evaluate(() => {
          const cardNumber =
            document.querySelector('#cartao_numero').textContent;
          const expirationDate =
            document.querySelector('#data_validade').textContent;
          const securityCode =
            document.querySelector('#codigo_seguranca').textContent;
          return { cardNumber, expirationDate, securityCode };
        });
        resolve(data);
      }, 1500);
    });
  }

  private Logger(message: string) {
    console.log(message);
  }

  private async generateDriverLicense(page: any): Promise<CnhEntity>{

    const generateRegister = `gerar()`;
    await page.addScriptTag({ content: generateRegister });

    this.Logger('DriverLicense Generated on the page');

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const result = await page.evaluate(() => {
          const data = document.getElementById('texto_cnh') as HTMLInputElement;
          return { numeroRegistro: data.value };
        }) as CnhEntity;         
        resolve(result);
      }, 1000);
    });

    

  }

  private async generateVehicle(page: any): Promise<VehicleEntity> {
    const generateVehicle = `gerar()`;
    await page.addScriptTag({ content: generateVehicle });
    this.Logger('Vehicle Generated on the page');

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const vehicle = await page.evaluate(async () => {

          const brand = document.querySelector('#marca').getAttribute('value');
          const model = document.querySelector('#modelo').getAttribute('value');
          const year = document.querySelector('#ano').getAttribute('value');
          const reindeer = document.querySelector('#renavam').getAttribute('value');
          const licensePlate = document.querySelector('#placa_veiculo').getAttribute('value');
          const color = document.querySelector('#cor').getAttribute('value');
    
          return {
            marca: brand,
            modelo: model,
            ano: year,
            renavam: reindeer,
            placa: licensePlate,
            cor: color,
          };
    
        }) as VehicleEntity;

        resolve(vehicle);
      }, 1000);
    });
    
  }

  private async getDriverLicense(): Promise<DriverLicenseResponse> {
    const personData = await this.getPerson();
    this.Logger('Starting Scrapping DriverLicense');
    console.time('Scrapping DriverLicense');
    const { chrome, puppeteer, options } =
      await this.defineChromePuppeterOptions();

    const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_cnh`;
    this.Logger(`Requesting URL:"${URL}"`);
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 10000, waitUntil: 'domcontentloaded' });
    this.Logger('Page Loaded');

    const cnh = await this.generateDriverLicense(page);
    this.Logger('Driver License Scrapped from the page');
    
    const driverLicense = new DriverLicenseResponse();
    driverLicense.fillPersonAndCnhData(personData, cnh);
    console.log(driverLicense);
    console.timeEnd('Scrapping DriverLicense');
    return driverLicense;
  }

  private async getVehicle(): Promise<VehicleEntity>{

    this.Logger('Starting Scrapping Vehicle');
    console.time('Scrapping Vehicle');
    const { chrome, puppeteer, options } =
      await this.defineChromePuppeterOptions();

    const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_veiculos`;
    this.Logger(`Requesting URL:"${URL}"`);
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 10000, waitUntil: 'domcontentloaded' });
    this.Logger('Page Loaded');

    const vehicle = await this.generateVehicle(page);

    this.Logger('Vehicle Scrapped from the page');
    console.log(vehicle)
    console.timeEnd('Scrapping Vehicle');
    return vehicle;

  
  }
  //#endregion

  //#region Public Methods
  async getPerson(): Promise<PersonResponse> {
    this.Logger('Starting Scrapping Person');
    console.time('Scrapping Person');

    const { chrome, puppeteer, options } =
      await this.defineChromePuppeterOptions();

    const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_pessoas`;
    this.Logger(`Requesting URL:"${URL}"`);

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 0, waitUntil: 'domcontentloaded' });
    this.Logger('Page Loaded');

    await page.evaluate(async () => {
      document.querySelector('#pontuacao_sim').setAttribute('value', 'N');
      document
        .querySelector('#bt_gerar_pessoa')
        .dispatchEvent(new CustomEvent('click'));
    });
    this.Logger('Click on Generate Person');

    await page.waitForFunction(
      'document.querySelector("#dados_json").textContent.includes("nome")',
    );
    this.Logger('Person Generated');
    const results = await page.evaluate(async () => {
      const data = document.querySelector('#dados_json').textContent;

      return JSON.parse(data) as [PersonEntity];
    });
    this.Logger('Person Scrapped');

    const personResponseMapper = new PersonResponseMapper();

    var person = personResponseMapper.mapTo(results[0]);
    console.log(person);
    console.timeEnd('Scrapping Person');
    return person;
  }

  async getCard(brand: BrandEnum): Promise<CardResponse> {
    try {
      this.Logger('Starting Scrapping Card');
      console.time('Scrapping Card');

      const { chrome, puppeteer, options } =
        await this.defineChromePuppeterOptions();

      const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_numero_cartao_credito`;
      this.Logger(`Requesting URL:"${URL}"`);
      const browser = await puppeteer.launch(options);

      const page = await browser.newPage();

      await page.goto(URL, { timeout: 10000, waitUntil: 'domcontentloaded' });
      this.Logger('Page Loaded');
      const result = await this.generateCard(brand, page);
      this.Logger('Card Generated');
      const cardResponseMapper = new CardResponseMapper();
      var card = cardResponseMapper.mapTo(result as CardEntity);
      card.brand = brand;
      this.Logger('Card Scrapped');
      console.log(card);
      console.timeEnd('Scrapping Card');
      return card;
    } catch (error) {
      console.timeEnd('Scrapping Card');
      console.log(error);
    }
  }

  async getDriver(): Promise<DriverResponse> {
    try {
      this.Logger('Generating a Driver');
      console.time('Scrapping Driver');

       const driverLicense = await this.getDriverLicense();
       const vehicle = await this.getVehicle();
      
      const vehicleResponseMapper = new VehicleResponseMapper();
      var vehicleResponse = vehicleResponseMapper.mapTo(vehicle);      
      const result = new DriverResponse(driverLicense, vehicleResponse);
      this.Logger('Driver Generated');
      console.log(result);
      console.timeEnd('Scrapping Driver');
      return result;
    } catch (error) {
      console.timeEnd('Scrapping Driver');
      console.log(error);
    }
  }

  //#endregion
}
