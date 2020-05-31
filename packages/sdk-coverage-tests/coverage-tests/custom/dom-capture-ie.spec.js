// re: https://trello.com/c/EQD3JUOf
const cwd = process.cwd()
const path = require('path')
const {getEyes, sauceUrl} = require('../util/TestSetup')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target} = require(cwd)
const {assertImage} = require('../util/ApiAssertions')

describe('JS Coverage Tests - Selenium 4', async () => {
  describe('edge', () => {
    let eyes
    let driver

    before(async () => {
      const sauceOptions = {
        screenResolution: '1920x1080',
        username: process.env.SAUCE_USERNAME,
        accesskey: process.env.SAUCE_ACCESS_KEY,
      }
      const capabilities = {
        browserName: 'MicrosoftEdge',
        browserVersion: '18',
        platformName: 'Windows 10',
        'sauce:options': sauceOptions,
      }
      driver = await spec.build({capabilities, serverUrl: sauceUrl})
      eyes = getEyes()
    })

    after(async () => {
      await spec.cleanup(driver)
      await eyes.abortIfNotClosed()
    })

    it('dom-capture-edge-classic', async function() {
      eyes.setMatchTimeout(0)
      await spec.visit(driver, 'http://applitools-dom-capture-origin-1.surge.sh/ie.html')
      await eyes.open(driver, this.test.parent.title, 'dom-capture-ie')
      await eyes.check(undefined, Target.window())
      const results = await eyes.close(false)
      await assertImage(results, {
        hasDom: true,
      })
    })
  })
  describe('ie', () => {
    let eyes
    let driver

    before(async () => {
      const sauceOptions = {
        screenResolution: '1920x1080',
        username: process.env.SAUCE_USERNAME,
        accesskey: process.env.SAUCE_ACCESS_KEY,
      }
      const capabilities = {
        browserName: 'MicrosoftEdge',
        browserVersion: '18',
        platformName: 'Windows 10',
        'sauce:options': sauceOptions,
        ...sauceOptions, // for wdio4
      }
      driver = await spec.build({capabilities, serverUrl: sauceUrl})
      eyes = getEyes()
    })

    after(async () => {
      await spec.cleanup(driver)
      await eyes.abortIfNotClosed()
    })

    it('dom-capture-ie-11', async function() {
      eyes.setMatchTimeout(0)
      await spec.visit(driver, 'http://applitools-dom-capture-origin-1.surge.sh/ie.html')
      await eyes.open(driver, this.test.parent.title, 'dom-capture-ie')
      await eyes.check(undefined, Target.window())
      const results = await eyes.close(false)
      await assertImage(results, {
        hasDom: true,
      })
    })
  })
})
