'use strict'
const assert = require('assert')
const {getDriver, getEyes} = require('../util/TestSetup')
const {Target, StitchMode} = require('../../../../index')
const appName = 'Applitools Eyes SDK'
describe(appName, () => {
  let browser, eyes, runner
  beforeEach(async () => {
    browser = await getDriver('CHROME')
    eyes = await getEyes('classic', StitchMode.CSS)
    runner = eyes.getRunner()
  })

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await browser.deleteSession()
  })

  it('TestDoubleOpenCheckClose', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    await eyes.open(browser, appName, 'TestDoubleOpenCheckClose', {
      width: 1200,
      height: 800,
    })
    await eyes.check(
      'Step 1',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes.close(false)

    await eyes.open(browser, appName, 'TestDoubleOpenCheckClose', {
      width: 1200,
      height: 800,
    })
    await eyes.check(
      'Step 2',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes.close(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })

  it('TestDoubleOpenCheckCloseAsync', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    await eyes.open(browser, appName, 'TestDoubleOpenCheckCloseAsync', {
      width: 1200,
      height: 800,
    })
    await eyes.check(
      'Step 1',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes.closeAsync(false)
    await eyes.open(browser, appName, 'TestDoubleOpenCheckCloseAsync', {
      width: 1200,
      height: 800,
    })
    await eyes.check(
      'Step 2',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes.closeAsync(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })
})
