import browser from "webextension-polyfill";
import { sendMessage } from "../../IO/message-port";
import { getScreenshot, getRegionScreenshot, isRegionInViewport } from "../utils/screenshot";
import { getEyes, closeEyes } from "../utils/eyes";
import ideLogger from "../utils/ide-logger";

export function checkWindow(runId, testId, commandId, tabId, windowId, stepName, viewport, forceFullPageScreenshot = false, removeScrollBars = false) {
  return new Promise((resolve, reject) => {
    getEyes(`${runId}${testId}`).then(eyes => {
      if (!eyes.didSetViewportSize) {
        ideLogger.warn("a visual check was called without setting a viewport size, results may be inconsistent");
      }
      eyes.commands.push(commandId);
      eyes.setViewportSize(viewport);
      getScreenshot(tabId, windowId, forceFullPageScreenshot, removeScrollBars, viewport).then((image) => {
        const image64 = image.replace("data:image/png;base64,", "");
        return eyes.checkImage(image64, stepName);
      }).then((imageResult) => {
        return imageResult.asExpected ? resolve(true) : resolve({ status: "undetermined" });
      }).catch(reject);
    }).catch(reject);
  });
}

export function checkElement(runId, testId, commandId, tabId, windowId, elementXPath, stepName, viewport, removeScrollBars = false) {
  return new Promise((resolve, reject) => {
    getEyes(`${runId}${testId}`).then(eyes => {
      if (!eyes.didSetViewportSize) {
        ideLogger.warn("a visual check was called without setting a viewport size, results may be inconsistent");
      }
      eyes.commands.push(commandId);
      eyes.setViewportSize(viewport);
      browser.tabs.sendMessage(tabId, {
        getElementRect: true,
        path: elementXPath
      }).then((rect) => {
        if (isRegionInViewport(rect, viewport)) {
          getRegionScreenshot(tabId, windowId, rect, removeScrollBars, viewport).then((image) => {
            const image64 = image.replace("data:image/png;base64,", "");
            return eyes.checkImage(image64, stepName);
          }).then((imageResult) => {
            return imageResult.asExpected ? resolve(true) : resolve({ status: "undetermined" });
          }).catch(reject);
        } else {
          reject(new Error("Element is out of bounds, try setting the viewport size to a bigger one."));
        }
      });
    }).catch(reject);
  });
}

export function endTest(id) {
  return closeEyes(id).then(results => {
    console.log(results);
    return Promise.all(results.commands.map((commandId, index) => (
      sendMessage({
        uri: "/playback/command",
        verb: "post",
        payload: {
          commandId,
          state: results.stepsInfo[index].isDifferent ? "failed" : "passed"
        }
      })
    ))).then((commandStates) => {
      console.log(commandStates);
      return results.isPassed
        ? { message: `All visual tests have passed,\nresults: ${results.appUrls.session}` }
        : { error: `There are visual tests failures,\nresults: ${results.appUrls.session}` };
    });
  });
}
