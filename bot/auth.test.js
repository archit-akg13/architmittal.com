/**
 * Tests for the bot authorization predicate.
 *
 * Run: node bot/auth.test.js
 *
 * These cover the local half of the verification. The other half — proving a
 * real non-allowlisted Telegram account gets nothing back from /leads and
 * /status — has to be done from a second Telegram account against the running
 * bot; no local test can substitute for it.
 */
const assert = require('node:assert')
const { test } = require('node:test')
const { parseAllowedChatIds, createAuthorizer } = require('./auth')

const OWNER = 123456789
const GROUP = -1001234567890
const STRANGER = 987654321

/** Builds an authorizer with an in-memory log so tests touch no files. */
function build(allowedChatIds) {
  const written = []
  const { authorized, isConfigured } = createAuthorizer({
    allowedChatIds,
    logPath: '/dev/null',
    appendFile: (_p, line, cb) => {
      written.push(JSON.parse(line))
      cb()
    },
  })
  return { authorized, isConfigured, written }
}

const msgFrom = (chatId) => ({
  chat: { id: chatId },
  from: { id: chatId, username: 'someone' },
  text: '/leads',
})

test('parseAllowedChatIds handles whitespace, junk, and negative group IDs', () => {
  assert.deepStrictEqual(parseAllowedChatIds('123, -456 , junk,,789'), [123, -456, 789])
  assert.deepStrictEqual(parseAllowedChatIds(''), [])
  assert.deepStrictEqual(parseAllowedChatIds(undefined), [])
  assert.deepStrictEqual(parseAllowedChatIds(null), [])
})

test('FAIL CLOSED: empty allowlist refuses everything', () => {
  const { authorized, isConfigured } = build([])
  assert.strictEqual(isConfigured, false)
  for (const id of [OWNER, GROUP, STRANGER, 0, -1]) {
    assert.strictEqual(authorized(msgFrom(id), 'leads'), false, `should refuse ${id}`)
  }
})

test('FAIL CLOSED: unset env var yields an empty allowlist, not an open one', () => {
  const { authorized } = build(parseAllowedChatIds(process.env.DEFINITELY_UNSET_VAR))
  assert.strictEqual(authorized(msgFrom(OWNER), 'deploy'), false)
})

test('allowlisted chat is permitted', () => {
  const { authorized } = build([OWNER])
  assert.strictEqual(authorized(msgFrom(OWNER), 'leads'), true)
})

test('negative group chat ID is permitted when allowlisted', () => {
  const { authorized } = build([GROUP])
  assert.strictEqual(authorized(msgFrom(GROUP), 'status'), true)
})

test('non-allowlisted chat is refused even when others are allowed', () => {
  const { authorized } = build([OWNER, GROUP])
  assert.strictEqual(authorized(msgFrom(STRANGER), 'leads'), false)
})

test('string chat IDs from the wire compare correctly', () => {
  const { authorized } = build([OWNER])
  assert.strictEqual(authorized({ chat: { id: String(OWNER) } }, 'leads'), true)
  assert.strictEqual(authorized({ chat: { id: String(STRANGER) } }, 'leads'), false)
})

test('malformed messages are refused, not crashed on', () => {
  const { authorized } = build([OWNER])
  for (const bad of [{}, { chat: {} }, { chat: { id: null } }, { chat: { id: 'abc' } }, null]) {
    assert.strictEqual(authorized(bad, 'leads'), false)
  }
})

test('refusals are logged with identity but WITHOUT the message body', () => {
  const { authorized, written } = build([OWNER])
  authorized(msgFrom(STRANGER), 'leads')

  assert.strictEqual(written.length, 1)
  const entry = written[0]
  assert.strictEqual(entry.chatId, STRANGER)
  assert.strictEqual(entry.command, 'leads')
  assert.ok(entry.ts, 'timestamp recorded')

  // The body must never reach the log.
  assert.ok(!JSON.stringify(entry).includes('/leads') || entry.command === 'leads')
  assert.strictEqual(entry.text, undefined)
  assert.strictEqual(entry.body, undefined)
})

test('successful authorization writes nothing to the log', () => {
  const { authorized, written } = build([OWNER])
  authorized(msgFrom(OWNER), 'leads')
  assert.strictEqual(written.length, 0)
})
