'use strict'

const FloatingMatchSettings = require('../..')
const GetFloatingRegion = require('./GetFloatingRegion')

/**
 * @ignore
 */
class FloatingRegionByRectangle extends GetFloatingRegion {
  /**
   * @param {Region} rect
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(rect, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super()
    this._rect = rect
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
  }

  /**
   * @inheritDoc
   */
  async getRegion(_eyesBase, _screenshot) {
    const floatingRegion = new FloatingMatchSettings({
      left: this._rect.getLeft(),
      top: this._rect.getTop(),
      width: this._rect.getWidth(),
      height: this._rect.getHeight(),
      maxUpOffset: this._maxUpOffset,
      maxDownOffset: this._maxDownOffset,
      maxLeftOffset: this._maxLeftOffset,
      maxRightOffset: this._maxRightOffset,
    })
    return [floatingRegion]
  }

  async toPersistedRegions(_driver) {
    return [
      {
        left: this._rect.getLeft(),
        top: this._rect.getTop(),
        width: this._rect.getWidth(),
        height: this._rect.getHeight(),
        maxUpOffset: this._maxUpOffset,
        maxDownOffset: this._maxDownOffset,
        maxLeftOffset: this._maxLeftOffset,
        maxRightOffset: this._maxRightOffset,
      },
    ]
  }
}

module.exports = FloatingRegionByRectangle
