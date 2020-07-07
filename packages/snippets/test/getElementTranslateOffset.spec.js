const playwright = require('playwright')
const {remote} = require('webdriverio')
const assert = require('assert')
const {getElementTranslateOffset} = require('../dist/index')

describe('getElementTranslateOffset', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let browser, page

    before(async () => {
      browser = await playwright.chromium.launch()
      const context = await browser.newContext()
      page = await context.newPage()
    })

    after(async () => {
      await browser.close()
    })

    it('specific element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      await page.evaluate(element => (element.style.transform = 'translate(-10px, -11px)'), element)
      const offset = await page.evaluate(getElementTranslateOffset, {element})
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })

    it('default element', async () => {
      await page.goto(url)
      await page.evaluate(
        () => (document.documentElement.style.transform = 'translate(-10px, -11px)'),
      )
      const offset = await page.evaluate(getElementTranslateOffset)
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })
  })

  describe('ie', () => {
    let driver

    before(async () => {
      driver = await remote({
        protocol: 'https',
        hostname: 'ondemand.saucelabs.com',
        path: '/wd/hub',
        port: 443,
        logLevel: 'silent',
        capabilities: {
          browserName: 'internet explorer',
          browserVersion: '11.285',
          platformName: 'Windows 10',
          'sauce:options': {
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY,
          },
        },
      })
    })

    after(async () => {
      await driver.deleteSession()
    })

    it('specific element', async () => {
      await driver.url(url)
      const element = await driver.$('#scrollable')
      await driver.execute(function(element) {
        element.style.transform = 'translate(-10px, -11px)'
      }, element)
      const offset = await driver.execute(getElementTranslateOffset, {element})
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })

    it('default element', async () => {
      await driver.url(url)
      await driver.execute(function() {
        document.documentElement.style.transform = 'translate(-10px, -11px)'
      })
      const offset = await driver.execute(getElementTranslateOffset)
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })
  })
})