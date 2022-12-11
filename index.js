
const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context, callback) => {
  let browser = null;
  let response = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    const dummy = {
      body: `<h1>hello world</h1>`
    }

    await page.setContent(event.body || dummy, {
      waitUntil: ["load", "networkidle0"],
    });

    const buffer = await page.pdf({ format: "A4" });


    // Todo maybe return just buffer
    /*
      headers: {
        "Content-type": "application/json",
        "content-disposition": "attachment; filename=test.pdf",
      },
    */
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: buffer,
      isBase64Encoded: false,
      message: "OK",
    };

  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, response);
};
