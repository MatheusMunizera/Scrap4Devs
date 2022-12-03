import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PersonEntity } from '../core/domain/entities/person.entity';
import { PersonResponseMapper } from '../core/domain/mappers/person/person-response.mapper';
import { PersonResponseDto } from '../shared/dtos/person/person-response.dto';


@Injectable()
export class ScraperService {
    @Inject(ConfigService)

    public baseUrl: string = process.env.BASE_URL_4DEVS;
    public config: ConfigService;
  
    constructor() {}


    async getPerson(): Promise<PersonResponseDto> {
        console.time('Scrapping')

        //#region Core puppeteer and ChromeAwsLambda
        let chrome: any = {};
        let puppeteer;

        if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
            chrome = require("chrome-aws-lambda");
            puppeteer = require("puppeteer-core");
        } else {
            puppeteer = require("puppeteer");
        }

        let options = {};

        if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
            options = {
                args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
                defaultViewport: chrome.defaultViewport,
                executablePath: await chrome.executablePath,
                headless: true,
                ignoreHTTPSErrors: true,
            };
        }
        //#endregion

        try {
            const URL = `${process.env.BASE_URL_4DEVS}/gerador_de_pessoas`;
            const browser = await puppeteer.launch(options);
            const page = await browser.newPage();
            await page.goto(URL, {'timeout':0, "waitUntil": "domcontentloaded" });
            await page.evaluate(async () => {
                document.querySelector('#pontuacao_sim').setAttribute('value', 'N');
                document.querySelector('#bt_gerar_pessoa').dispatchEvent(new CustomEvent('click'));
            });
            
            await page.waitForFunction(
                'document.querySelector("#dados_json").textContent.includes("nome")'
            );
            
            const results = await page.evaluate(async () => {
                const data = document.querySelector('#dados_json').textContent;
                
                return JSON.parse(data) as [PersonEntity];
            });
           
            const personResponseMapper = new PersonResponseMapper();
            
            var person = personResponseMapper.mapTo(results[0]);

            console.timeEnd('Scrapping')
            return person;

        } catch (err) {
            console.error(err);
            return null;
        }

    }
}