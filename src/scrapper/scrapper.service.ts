import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

@Injectable()
export class ScrapperService {
    async getDataViaPuppeteer() {
        const URL = `https://www.4devs.com.br/gerador_de_pessoas`;

        const options = {
            args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        }

        const browser = await puppeteer.launch(options);
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