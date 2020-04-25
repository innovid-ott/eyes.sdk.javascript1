const GET_VIEWPORT_SIZE =
  'var height, width; ' +
  'if (window.innerHeight) { height = window.innerHeight; } ' +
  'else if (document.documentElement && document.documentElement.clientHeight) { height = document.documentElement.clientHeight; } ' +
  'else { var b = document.getElementsByTagName("body")[0]; if (b.clientHeight) {height = b.clientHeight;} }; ' +
  'if (window.innerWidth) { width = window.innerWidth; } ' +
  'else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } ' +
  'else { var b = document.getElementsByTagName("body")[0]; if (b.clientWidth) { width = b.clientWidth;} }; ' +
  'return [width, height];'

const GET_CONTENT_ENTIRE_SIZE = `
  var scrollWidth = document.documentElement.scrollWidth;
  var bodyScrollWidth = document.body.scrollWidth;
  var totalWidth = Math.max(scrollWidth, bodyScrollWidth);
  var clientHeight = document.documentElement.clientHeight;
  var bodyClientHeight = document.body.clientHeight;
  var scrollHeight = document.documentElement.scrollHeight;
  var bodyScrollHeight = document.body.scrollHeight;
  var maxDocElementHeight = Math.max(clientHeight, scrollHeight);
  var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight);
  var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight);
  return [totalWidth, totalHeight];
`

const GET_ELEMENT_ENTIRE_SIZE = `
  var element = arguments[0];
  return [element.scrollWidth, element.scrollHeight];
`

const GET_SCROLL_POSITION = `
  var element = arguments[0] || document.scrollingElement;
  if (element) return [element.scrollLeft, element.scrollTop];
  else {
    var doc = document.documentElement;
    return [
      window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)),
      window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0))
    ];
  }
`

const SCROLL_TO = (x, y) => `
  var element = arguments[0] || document.scrollingElement || window;
  element.scrollTo(${x}, ${y});
`

const TRANSFORM_KEYS = ['transform', '-webkit-transform']

const GET_TRANSFORMS = `
  var element = arguments[0] || document.documentElement;
  return {${TRANSFORM_KEYS.map(key => `['${key}']: element.style['${key}']`).join(',')}};
`

const SET_TRANSFORMS = transforms => `
  var element = arguments[0] || document.documentElement;
  ${Object.entries(transforms)
    .map(([key, value]) => `element.style['${key}'] = '${value}'`)
    .join(';')}
`

const TRANSLATE_TO = (x, y) => `
  var element = arguments[0] || document.documentElement;
  element.scrollTo(0, 0);
  ${TRANSFORM_KEYS.map(key => `element.style['${key}'] = 'translate(10px, -${y}px)'`).join(';')}
  ${TRANSFORM_KEYS.map(key => `element.style['${key}'] = 'translate(-${x}px, -${y}px)'`).join(';')}
`

const GET_OVERFLOW = `
  var el = arguments[0];
  return el.style.overflow;
`

const SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE = overflow => `
  var el = arguments[0]; var origOverflow = el.style.overflow; var newOverflow = '${overflow}';
  el.style.overflow = newOverflow;
  if (newOverflow.toUpperCase() === 'HIDDEN' && origOverflow.toUpperCase() !== 'HIDDEN') { el.setAttribute('data-applitools-original-overflow', origOverflow); }
  return origOverflow;
`

const GET_ELEMENT_XPATH = `
  function genXpath(el) {
    if (!el.ownerDocument) return ''; // this is the document node

    let xpath = '',
      currEl = el,
      doc = el.ownerDocument,
      frameElement = doc.defaultView.frameElement;
    while (currEl !== doc) {
      xpath = currEl.tagName + '[' + getIndex(currEl) + ']/' + xpath;
      currEl = currEl.parentNode;
    }
    if (frameElement) {
      xpath = genXpath(frameElement) + ',' + xpath;
    }
    return xpath.replace(/\\/$/, '');
  }
  function getIndex(el) {
    return (
      Array.prototype.filter
        .call(el.parentNode.childNodes, node => node.tagName === el.tagName)
        .indexOf(el) + 1
    );
  }
  return genXpath(arguments[0])
`

const GET_FRAME_INFO = `
  var isCORS, isRoot, frameElement;
  try {
    isRoot = window.top.document === window.document;
  } catch (err) {
    isRoot = false;
  }
  try {
    isCORS = !window.parent.document === window.document;
    frameElement = window.frameElement;
  } catch (err) {
    isCORS = true;
    frameElement = null;
  }
  return {isRoot: isRoot, isCORS: isCORS, frameElement: frameElement, contentDocument: document};
`

const GET_CORS_FRAMES = `
  var frames = document.querySelectorAll('frame, iframe');
  return Array.prototype.filter.call(frames, function(frameElement) {
    return !frameElement.contentDocument;
  });
`

module.exports = {
  GET_VIEWPORT_SIZE,
  GET_CONTENT_ENTIRE_SIZE,
  GET_ELEMENT_ENTIRE_SIZE,
  GET_SCROLL_POSITION,
  SCROLL_TO,
  GET_TRANSFORMS,
  SET_TRANSFORMS,
  TRANSLATE_TO,
  GET_OVERFLOW,
  SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE,
  GET_ELEMENT_XPATH,
  GET_FRAME_INFO,
  GET_CORS_FRAMES,
}