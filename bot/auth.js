/**
 * Authorization for the Telegram bot.
 *
 * Kept in its own module so the fail-closed behaviour can be tested directly
 * (see auth.test.js) instead of only reviewed by eye. bot.js starts polling on
 * require, which makes it awkward to exercise in a test.
 */
const fs = require('fs')

/** "123, -456, junk" -> [123, -456]. Group chat IDs are negative, hence Number not parseInt. */
function parseAllowedChatIds(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => Number(s.trim()))
    .filter(Boolean)
}

/**
 * Builds the authorization predicate.
 *
 * @param {number[]} allowedChatIds  Empty array means refuse everything.
 * @param {string}   logPath         Where refused attempts are appended.
 * @param {Function} appendFile      Injectable for tests.
 */
function createAuthorizer({ allowedChatIds, logPath, appendFile = fs.appendFile }) {
  const allowed = new Set(allowedChatIds.map(Number))

  function logRejection(msg, command) {
    // Command name only. Message bodies may contain personal data and are never logged.
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      chatId: msg?.chat?.id ?? null,
      fromId: msg?.from?.id ?? null,
      username: msg?.from?.username ?? null,
      command,
    })
    appendFile(logPath, line + '\n', () => {})
  }

  /**
   * True only for allowlisted chats.
   *
   * Refusals are silent — replying "unauthorized" confirms to a prober that the
   * bot exists and is live.
   */
  function authorized(msg, command) {
    if (allowed.size === 0) return false // fail closed, never open

    const chatId = Number(msg?.chat?.id)
    if (Number.isFinite(chatId) && allowed.has(chatId)) return true

    logRejection(msg, command)
    return false
  }

  return { authorized, isConfigured: allowed.size > 0, allowedCount: allowed.size }
}

module.exports = { parseAllowedChatIds, createAuthorizer }
