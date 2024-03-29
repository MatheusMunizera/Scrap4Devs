import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
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
import { BankAccountEntity } from '../core/domain/entities/bank-account.entity';
import { BankEnum } from '../shared/enum/bank.enum';
import { BaseService } from '../core/services/base.service';

@Injectable()
export class ScraperService extends  BaseService  implements OnModuleInit {

  @Inject(ConfigService)
  public baseUrl: string = process.env.BASE_URL_4DEVS;
  public config: ConfigService;
  public chrome;
  public puppeteer;
  public options;

  async onModuleInit() {
    const { chrome, puppeteer, options } =
      await this.defineChromePuppeterOptions();
    this.chrome = chrome;
    this.puppeteer = puppeteer;
    this.options = options;
  }

  constructor() {super()}

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
    this.Logger('Card Generated');

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const data = await page.evaluate(() => {
          const cardNumber =
            document.querySelector('#cartao_numero').textContent;
          const expirationDate =
            document.querySelector('#data_validade').textContent;
          const securityCode =
            document.querySelector('#codigo_seguranca').textContent;
          return {
            numeroCartao: cardNumber,
            dataValidade: expirationDate,
            codigoSeguranca: securityCode,
          };
        });
        resolve(data);
      }, 500);
    });
  }

  private async generateDriverLicense(page: any): Promise<CnhEntity> {
    const generateRegister = `gerar()`;
    await page.addScriptTag({ content: generateRegister });

    this.Logger('DriverLicense Generated on the page');

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const result = (await page.evaluate(() => {
          const data = document.getElementById('texto_cnh') as HTMLInputElement;
          return { numeroRegistro: data.value };
        })) as CnhEntity;
        resolve(result);
      }, 500);
    });
  }

  private async generateVehicle(page: any): Promise<VehicleEntity> {
    const generateVehicle = `gerar()`;
    await page.addScriptTag({ content: generateVehicle });
    this.Logger('Vehicle Generated on the page');

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const vehicle = (await page.evaluate(async () => {
          const brand = document.querySelector('#marca').getAttribute('value');
          const model = document.querySelector('#modelo').getAttribute('value');
          const year = document.querySelector('#ano').getAttribute('value');
          const reindeer = document
            .querySelector('#renavam')
            .getAttribute('value');
          const licensePlate = document
            .querySelector('#placa_veiculo')
            .getAttribute('value');
          const color = document.querySelector('#cor').getAttribute('value');

          return {
            marca: brand,
            modelo: model,
            ano: year,
            renavam: reindeer,
            placa: licensePlate,
            cor: color,
          };
        })) as VehicleEntity;

        resolve(vehicle);
      }, 500);
    });
  }

  private async generateBankAccount(
    bank: BankEnum,
    page: any,
  ): Promise<BankAccountEntity> {
    await page.waitForFunction(
      `document.querySelector("#cc_banco").value = ${BankEnum[bank]}`,
    );

    const generateBankAccount = `gerar_cb()`;
    await page.addScriptTag({ content: generateBankAccount });
    this.Logger('Bank Account Generated on the page');

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const bankAccount = (await page.evaluate(async () => {
          const checkingAccount =
            document.querySelector('#conta_corrente').textContent;
          const agency = document.querySelector('#agencia').textContent;
          const bank = document.querySelector('#banco').textContent;

          return {
            contaCorrente: checkingAccount,
            agencia: agency,
            banco: bank,
          };
        })) as BankAccountEntity;

        resolve(bankAccount);
      }, 2000);
    });
  }

  private async getDriverLicense(): Promise<DriverLicenseResponse> {
    const personData = await this.getPerson();
    this.Logger('Starting Scrapping DriverLicense');

    const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_cnh`;
    this.Logger(`Requesting URL:"${URL}"`);
    const browser = await this.puppeteer.launch(this.options);
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 10000, waitUntil: 'domcontentloaded' });
    this.Logger('Page Loaded');

    const cnh = await this.generateDriverLicense(page);
    this.Logger('Driver License Scrapped from the page');

    const driverLicense = new DriverLicenseResponse();
    driverLicense.fillPersonAndCnhData(personData, cnh);
    this.Logger(driverLicense);
    browser.close();
    return driverLicense;
  }

  private async getVehicle(): Promise<VehicleEntity> {
    this.Logger('Starting Scrapping Vehicle');

    const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_veiculos`;
    this.Logger(`Requesting URL:"${URL}"`);
    const browser = await this.puppeteer.launch(this.options);
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 10000, waitUntil: 'domcontentloaded' });
    this.Logger('Page Loaded');

    const vehicle = await this.generateVehicle(page);

    this.Logger('Vehicle Scrapped from the page');
    this.Logger(vehicle);
    browser.close();
    return vehicle;
  }

  private async getBankAccount(bank: BankEnum): Promise<BankAccountEntity> {
    this.Logger('Starting Scrapping Bank Account');
    const URL = `${process.env.BASE_URL_4DEVS}/gerador_conta_bancaria`;
    this.Logger(`Requesting URL:"${URL}"`);
    const browser = await this.puppeteer.launch(this.options);
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 10000, waitUntil: 'domcontentloaded' });
    this.Logger('Page Loaded');
    const bankAccount = await this.generateBankAccount(bank, page);
    this.Logger('Bank Account Scrapped from the page');

    browser.close();
    return bankAccount;
  }
  //#endregion

  //#region Public Methods
  async getPerson(): Promise<PersonResponse> {
    this.Logger('Starting Scrapping Person');

    const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_pessoas`;
    this.Logger(`Requesting URL:"${URL}"`);

    const browser = await this.puppeteer.launch(this.options);
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
    this.Logger(person);
    browser.close();
    return person;
  }

  async getCard(brand: BrandEnum, bank: BankEnum): Promise<CardResponse> {
    try {
      this.Logger('Starting Scrapping CreditCard');

      const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_numero_cartao_credito`;
      this.Logger(`Requesting URL:"${URL}"`);
      const browser = await this.puppeteer.launch(this.options);

      const page = await browser.newPage();

      await page.goto(URL, { timeout: 10000, waitUntil: 'domcontentloaded' });
      this.Logger('Page Loaded');
      const result = await this.generateCard(brand, page);
      this.Logger('Card Scrapped from the page');

      const bankAccount = await this.getBankAccount(bank);

      const cardResponseMapper = new CardResponseMapper();
      var card = cardResponseMapper.mapTo(result as CardEntity);
      card.brand = brand;
      card.fillBankAccount(bankAccount);
      this.Logger(card);
      browser.close();
      return card;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getDriver(): Promise<DriverResponse> {
    try {
      this.Logger('Generating a Driver');

      const driverLicense = await this.getDriverLicense();
      const vehicle = await this.getVehicle();

      const vehicleResponseMapper = new VehicleResponseMapper();
      var vehicleResponse = vehicleResponseMapper.mapTo(vehicle);
      const result = new DriverResponse(driverLicense, vehicleResponse);
      this.Logger('Driver Generated');
      this.Logger(result);

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //#endregion
}
