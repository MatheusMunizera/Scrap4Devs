import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';


@Injectable()
export class ScrapperService {
    async getDataViaPuppeteer() {
        const URL = `https://www.4devs.com.br/gerador_de_pessoas`;
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();
        await page.goto(URL, { "waitUntil": "networkidle2" });
        await page.evaluate(async () => {
            document.querySelector('#bt_gerar_pessoa').dispatchEvent(new CustomEvent('click'));
        });

        await page.waitForFunction(
            'document.querySelector("#dados_json").innerText.includes("nome")'
        );

        const results = await page.evaluate(async () => {
            const data = document.querySelector('#dados_json').textContent;
            return data;
        });


        console.log('getDataViaPuppeteer results :', results);
        await browser.close();
        return results;
    }
}