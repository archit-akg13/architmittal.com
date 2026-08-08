# Deploy runbook — security fix rollout

One ordered sequence. Follow it start to finish. The ordering is deliberate:
several steps exist because an earlier version of this plan would have broken
something silently.

**Step 12 is the completion criterion.** Nothing before it counts as verified.

> Supersedes the ordering notes scattered in `docs/VPS-DEPLOY-USER-SETUP.md`.
> That file is now only the detailed VPS deploy-user procedure, referenced from
> Step 14.

---

## Step 0 — Precondition (done outside this repo)

- [ ] Bot token revoked via @BotFather, or the bot process stopped.

Until this is true the live exposure is open: any Telegram user can call
`/leads` and `/subscribers`. Everything below assumes it is already closed.

---

## Step 1 — 🚨 Rescue existing leads before anything rebuilds

**Do this first. A build destroys them.**

The site has been writing leads to `.next/standalone/data/` (the standalone
server calls `process.chdir(__dirname)`), and `next build` overwrites that
directory from the repo copy. Any deploy — including the one in this runbook —
wipes whatever is there.

On the VPS:

```bash
cd /var/www/architmittal.com
cat .next/standalone/data/inquiries.json   | head -c 400
cat .next/standalone/data/subscribers.json | head -c 400
```

If either holds real records, preserve them now:

```bash
mkdir -p /var/backups/architmittal
cp .next/standalone/data/*.json /var/backups/architmittal/
ls -la /var/backups/architmittal/
```

Then seed the new location, so the fix starts from real data rather than empty:

```bash
mkdir -p /var/www/architmittal.com/data
cp /var/backups/architmittal/inquiries.json   /var/www/architmittal.com/data/
cp /var/backups/architmittal/subscribers.json /var/www/architmittal.com/data/
```

If both files are `[]`, there is nothing to rescue — note that and move on.

---

## Step 2 — Set the environment on the VPS

Harmless while the old code runs — nothing reads these yet. That is exactly why
it goes before the push: no window where new code is live without its config.

```bash
SECRET=$(openssl rand -hex 32)

printf 'NOTIFY_SECRET=%s\n' "$SECRET" > /var/www/architmittal.com/.env.server
chmod 600 /var/www/architmittal.com/.env.server

cd /var/www/architmittal.com/bot
printf 'NOTIFY_SECRET=%s\n' "$SECRET" >> .env
printf 'TELEGRAM_ALLOWED_CHAT_IDS=<your-dm-id>,<group-id>\n' >> .env
chmod 600 .env
```

Both files must carry the **same** `NOTIFY_SECRET` — Step 3 checks this.

Find your chat IDs by messaging [@userinfobot](https://t.me/userinfobot).

> The allowlist falls back to `TELEGRAM_CHAT_ID`, which is your **group** ID.
> Your DMs use a different ID. Include both, or the bot will refuse you.

---

## Step 3 — Preflight must pass before anything is pushed

```bash
cd /var/www/architmittal.com
node scripts/preflight.mjs --files
```

Must exit 0. It verifies both files parse, the secrets **match** (by salted
fingerprint — it never prints a value), the chat IDs parse to at least one
non-zero ID, and the secret is not trivially short.

`--files` skips the pm2 checks, which cannot pass yet because the new code is
not deployed.

**Do not continue until this exits 0.**

---

## Step 4 — Create the PAT and push

PAT on the **`archit-akg13`** account (not `archit1302` — that mismatch is why
pushes 403), scoped to this repo, Contents: Read and write.

```bash
printf 'GITHUB_TOKEN=YOUR_TOKEN\n' > ~/.config/automation/github.env
chmod 600 ~/.config/automation/github.env
```

Then push `main`. Do **not** merge `deploy-auth-hardening` yet — that comes at
Step 14, after the deploy user exists.

---

## Step 5 — Confirm the Action actually succeeded

`git push` returning 0 is not evidence of deployment.

```
https://github.com/archit-akg13/architmittal.com/actions
```

Wait for a green run. If it is red, stop and read the log — nothing below will
work.

---

## Step 6 — Poll the live URL

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://architmittal.com
```

Expect `200`. A green Action with a broken site means the build succeeded and
the process failed to restart — check `pm2 logs architmittal-website`.

---

## Step 7 — Restart with the new environment

```bash
cd /var/www/architmittal.com
pm2 restart ecosystem.config.js --update-env
pm2 restart archit-telegram-bot
```

**Not** plain `pm2 restart architmittal-website`. That reuses the saved
environment and will not pick up `NOTIFY_SECRET` or `DATA_DIR` from
`ecosystem.config.js`, leaving you with new code and stale config — which looks
like it worked.

Check the bot came up authorized:

```bash
pm2 logs archit-telegram-bot --lines 10 --nostream
```

Expect `🔒 Authorized chat IDs: 2`. If you see the ⚠️ warning instead, the env
did not load and the bot is refusing everyone, including you.

---

## Step 8 — Re-run preflight, now against the running processes

```bash
node scripts/preflight.mjs
```

Must exit 0. This is the run that matters: it reads the **pm2 environment**, so
it catches config that is correct on disk but absent from the live process. It
also verifies `DATA_DIR` is absolute, outside `.next/`, and writable.

---

## Step 9 — Negative test (the one that actually proves the fix)

From a Telegram account **not** on the allowlist — a second account, or a
friend's:

- [ ] Send `/leads` → **expect complete silence.** No reply, no error.
- [ ] Send `/status` → **expect complete silence.**
- [ ] Send `EXECUTE_TASK: deploy` → **expect complete silence.**

Any reply at all means the allowlist is not in effect. Stop and re-check Step 7.

Then confirm the attempts were recorded:

```bash
tail -5 /var/www/architmittal.com/bot/auth-rejections.log
```

Expect one JSON line per attempt with the chat ID and command — and **no message
bodies**.

---

## Step 10 — Positive test

From **your own** account:

- [ ] `/status` → returns pm2 status
- [ ] `/leads` → returns inquiries (or "No inquiries yet")
- [ ] `/health` → returns 200/UP

If these are silent, your DM chat ID is missing from
`TELEGRAM_ALLOWED_CHAT_IDS` — it differs from the group ID.

---

## Step 11 — Verify lead capture end to end

The part that was silently broken. Submit a real form at
`https://architmittal.com/contact`, then:

```bash
cat /var/www/architmittal.com/data/inquiries.json | tail -20
```

- [ ] The submission is in `/var/www/architmittal.com/data/`, **not**
      `.next/standalone/data/`
- [ ] A Telegram notification arrived (proves `NOTIFY_SECRET` matches on both
      sides — a mismatch 401s silently)
- [ ] Submitting 6 times within an hour returns `429` on the sixth

---

## Step 12 — ✅ Completion criterion for the security fix

The security fix counts as verified only when **Steps 9, 10 and 11 have all
passed**. Code review, a green Action, and a 200 from the site are not
sufficient — every one of those was true while the bot was wide open and leads
were being discarded.

- [ ] Step 9 negative test: silence confirmed from a non-allowlisted account
- [ ] Step 10 positive test: your own account works
- [ ] Step 11: lead written to the right directory and notified

---

## Step 13 — Confirm the legal links are live

```bash
curl -s https://architmittal.com | grep -o 'href="/terms-and-conditions"\|href="/refund-policy"'
```

- [ ] Both appear
- [ ] `/contact` renders the Contact Us legal block
- [ ] Privacy policy still missing — outstanding, required by Indian payment
      gateways alongside Terms and Refund

---

## Step 14 — VPS deploy user, then merge `deploy-auth-hardening`

Only now. Follow `docs/VPS-DEPLOY-USER-SETUP.md` Steps 0–7 in full: create the
`deploy` user, move pm2 to it, install the ed25519 key, add `VPS_SSH_KEY`, then
merge the branch and confirm a green run.

- [ ] `deploy` user created and owns `/var/www/architmittal.com`
- [ ] pm2 running as `deploy` (or the narrow sudoers rule in place)
- [ ] `VPS_SSH_KEY` secret added
- [ ] `deploy-auth-hardening` merged and pushed
- [ ] Action green with key auth
- [ ] Site still 200
- [ ] `node scripts/preflight.mjs` still exits 0 after the pm2 ownership change

---

## Step 15 — Only after Step 14 is proven: retire the password

- [ ] Delete `VPS_PASSWORD` from GitHub secrets
- [ ] `passwd root` on the VPS — it sat in GitHub secrets and possibly in old
      workflow logs
- [ ] Disable password auth and root login
      (`docs/VPS-DEPLOY-USER-SETUP.md` Step 7), keeping a session open

---

## Rollback

| Failure point | Action |
|---|---|
| Step 5 red | Read the Action log; the old code is still serving |
| Step 7 bot silent to everyone | `TELEGRAM_ALLOWED_CHAT_IDS` missing from pm2 env — re-run Step 7 |
| Step 11 no notification | Secrets differ; re-run Step 3, then Step 7 |
| Step 14 Action red | Revert the merge — root/password still works until Step 15 |
