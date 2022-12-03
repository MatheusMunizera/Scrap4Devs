import { Injectable } from '@nestjs/common';


@Injectable()
export class ScrapperService {
    async getDataViaPuppeteer() {
        console.time('Scrapper')
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
        try {
            const URL = `https://www.4devs.com.br/gerador_de_pessoas`;
            const browser = await puppeteer.launch(options);
            const page = await browser.newPage();
            await page.goto(URL, {'timeout':0, "waitUntil": "domcontentloaded" });
            await page.evaluate(async () => {
                document.querySelector('#bt_gerar_pessoa').dispatchEvent(new CustomEvent('click'));
            });
            
            await page.waitForFunction(
                'document.querySelector("#dados_json").textContent.includes("nome")'
            );
            
            const results = await page.evaluate(async () => {
                const data = document.querySelector('#dados_json').textContent;
                return data;
            });


            console.log('getDataViaPuppeteer results :', results);
            console.timeEnd('Scrapper')
            
             return JSON.parse(results);
        } catch (err) {
            console.error(err);
            return null;
        }

    }
}