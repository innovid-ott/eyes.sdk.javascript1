const Enum = require('../utils/Enum')

/**
 * @typedef {string} SessionType
 */

/**
 * Represents the types of available stitch modes.
 */
const SessionTypes = Enum('SessionType', {
  /** Default type of sessions. */
  SEQUENTIAL: 'SEQUENTIAL',
  /** A timing test session */
  PROGRESSION: 'PROGRESSION',
})

module.exports = SessionTypes
