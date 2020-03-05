'use strict'
const assert = require('assert')
const {remote} = require('webdriverio')
const {Target, Configuration, BatchInfo, Eyes, VisualGridRunner} = require('../../../index')
const batch = new BatchInfo('WebdriverIO 5 tests')
describe('TestCounts', () => {
  let browser, eyes, runner
  beforeEach(async () => {
    browser = await remote({
      logLevel: 'silent',
      capabilities: {
        browserName: 'chrome',
      },
    })
    // await browser.init()
    await browser.url('https://applitools.com/helloworld')
    runner = new VisualGridRunner(10)
    eyes = new Eyes(runner)
    eyes.setParentBranchName('master')
    await eyes.setSendDom(false)
  })

  it('Test_VGTestsCount_1', async () => {
    await eyes.setBatch(batch)
    await eyes.setBranchName('master')
    await eyes.open(browser, 'Test Count', 'Test_VGTestsCount_1', {width: 640, height: 480})
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_2', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(browser, 'Test Count', 'Test_VGTestsCount_2')
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_3', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_3')
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(browser)
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_4', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_4')
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(browser)
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_5', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(browser, 'Test Count', 'Test_VGTestsCount_5', {width: 640, height: 480})
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })
})
