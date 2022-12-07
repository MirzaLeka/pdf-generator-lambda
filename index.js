const { createWriteStream } = require('fs');
const { randomBytes } = require('crypto');

const logger = ({ message, payload, exception, response, level = 'info' }) => {

    const content = `${JSON.stringify(
        {
          message,
          date: new Date(),
          logId: randomBytes(16).toString('hex'),
          level,
          environment: process.env.NODE_ENV,
          payload,
          response,
          exception
        },
        null,
        4
      )},`

    createWriteStream('./generate-pdf.log', { flags: 'a' }).write(
        content,
        (err) => {
          if (err) {
            console.error(err)
          }
          console.log('logs set!')
        }
      )
}

const handler = async (event) => {

    // let puppeteer;
    logger({ message: 'Handler executed', payload: event.body })

    // if (process.env.NODE_ENV !== 'production') {
    //     puppeteer = require("puppeteer");
    //     console.log('loading PPT');

    //     logger({ message: 'running PPT' })

    //       try {
    //         const browser = await puppeteer.launch();

    //         const page = await browser.newPage();

    //         await page.setContent(event.body, {
    //           waitUntil: ["load", "networkidle0"],
    //         });

    //         const buffer = await page.pdf({ format: "A4" });

    //         console.log('buffer :>> ', buffer);

    //         const response = {
    //             statusCode: 200,
    //             headers: {
    //               "Content-type": "application/pdf",
    //               "content-disposition": "attachment; filename=test.pdf",
    //             },
    //             body: buffer,
    //             isBase64Encoded: false,
    //             message: 'OK'
    //           };

    //         logger({ response, message: 'gonna drop response for PPT' })

    //           console.log('response :>> ', response);

    //         return response

    //       } catch (e) {
    //         logger({ exception: e?.message, message: 'gonna throw error PPT', level: 'error' })

    //         console.log('catch error ', e?.message);
    //         return {
    //           statusCode: 500,
    //           body: null,
    //           message: e?.message
    //         };
    //       }

    // } else {

        console.log('loading PPT -- CORE');

        logger({ message: 'running PPT - CORE' })


        const chrome = require("chrome-aws-lambda");
        const puppeteer = require("puppeteer-core");

        const options = {
            args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
          };

          console.log('process.NODE_ENV :>> ', process.NODE_ENV);

          try {
            const browser = await puppeteer.launch(options);

            const page = await browser.newPage();

            await page.setContent(event.body, {
              waitUntil: ["load", "networkidle0"],
            });

            const buffer = await page.pdf({ format: "A4" });

            console.log('buffer :>> ', buffer);


            const response = {
                statusCode: 200,
                headers: {
                  "Content-type": "application/pdf",
                  "content-disposition": "attachment; filename=test.pdf",
                },
                body: buffer,
                isBase64Encoded: false,
                message: 'OK'
              };

            logger({ response, message: 'gonna drop response for PPT - CORE' })


              console.log('response :>> ', response);

            return response

          } catch (e) {
            logger({ exception: e?.message, message: 'gonna throw error PPT-CORE', level: 'error' })

            console.log('catch error ', e?.message);
            return {
              statusCode: 500,
              body: null,
              message: e?.message
            };
          }

    // }



};


module.exports = { handler }