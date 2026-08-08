# VPS deploy user setup

Replaces the old deploy auth (`root` + `secrets.VPS_PASSWORD`) with a scoped `deploy`
user authenticating by ed25519 key.

**The workflow still uses `root` + `VPS_PASSWORD` today.** The switch is prepared on the
`deploy-auth-hardening` branch and deliberately not merged, so that deploys keep working
while you do the VPS-side setup below. Merging it before the `deploy` user and
`VPS_SSH_KEY` secret exist would break every deploy.

Order of operations:

1. Work through Steps 0–6 below.
2. Only once Step 6 passes, merge `deploy-auth-hardening`, which applies:
   ```yaml
   username: deploy
   key: ${{ secrets.VPS_SSH_KEY }}
   ```
3. Then do Step 7.

The deploy script steps themselves are unchanged.

> **Keep a second SSH session open as root for the whole of this runbook.** Step 7
> disables password login and root login. If you close your only session before
> testing the new key, you are locked out of the box.

---

## Step 0 — Find out who runs pm2 today

This determines which path you take in Step 3. Run as root:

```bash
ps -o user= -p "$(pgrep -f 'PM2 v' | head -1)"
command -v pm2
pm2 list
```

Almost certainly it prints `root` — the current workflow SSHes in as root and calls
`pm2 restart`, so the daemon holding `architmittal-website` belongs to root. A process
manager running your public web app as root is the thing worth fixing here; the SSH key
is only half the problem.

Note the `command -v pm2` path. If it sits under `/root/.nvm/...`, the `deploy` user
cannot execute it at all, which rules out Option B in Step 3.

---

## Step 1 — Create the deploy user

```bash
adduser --disabled-password --gecos "" deploy
```

No password is set: this account authenticates by key only, and `--disabled-password`
means there is no password to brute-force.

---

## Step 2 — Hand over the site directory

`git reset --hard`, `npm ci` and `npm run build` all write inside the repo, so `deploy`
must own it outright.

```bash
chown -R deploy:deploy /var/www/architmittal.com
```

Confirm git will work there — newer git refuses repos owned by another user:

```bash
sudo -u deploy git -C /var/www/architmittal.com status
```

If that complains about "dubious ownership", the `chown` did not cover everything.
Re-run it and check again rather than adding a `safe.directory` override.

---

## Step 3 — Decide how pm2 gets restarted

### Option A — move pm2 to the deploy user (recommended)

The app stops running as root, and `pm2 restart architmittal-website` in the workflow
works as-is with **no sudo and no sudoers entry at all**. Least privilege, and the
deploy script stays byte-for-byte unchanged.

Costs a few seconds of downtime.

```bash
# 1. Remove the app from root's pm2
pm2 delete architmittal-website
pm2 save

# 2. Start it under deploy
sudo -u deploy -H bash -lc 'cd /var/www/architmittal.com && pm2 start ecosystem.config.js && pm2 save'

# 3. Make it survive reboot as deploy
env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
# ^ prints a command — run exactly what it prints

# 4. Verify
sudo -u deploy -H pm2 list
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3002
```

Port 3002 is above 1024, so a non-root user can bind it. Nginx proxies to
`127.0.0.1:3002` regardless of who owns the process — no nginx change needed.

If pm2 is not on `deploy`'s PATH, install it globally: `npm i -g pm2`.

### Option B — keep pm2 under root, add one narrow sudoers rule

Only if Option A is impractical. The app keeps running as root, which is the weaker
outcome, and it needs a one-line change to the workflow (`sudo pm2 restart ...`).

```bash
# Use the exact path from Step 0
visudo -f /etc/sudoers.d/deploy-pm2
```

```
deploy ALL=(root) NOPASSWD: /usr/bin/pm2 restart architmittal-website
```

```bash
chmod 440 /etc/sudoers.d/deploy-pm2
visudo -c          # must print "parsed OK" before you log out
```

This grants exactly one command with exactly those arguments — no wildcards, no
`pm2 *`, nothing else. A wildcard here would be equivalent to handing over root, since
`pm2 start` can run arbitrary scripts as root.

**This option does not work if pm2 lives under `/root/.nvm/`** — `deploy` cannot read
that path. Use Option A instead.

---

## Step 4 — Generate the deploy keypair

Generate it **on the VPS**, then move the private half to GitHub. Name it distinctly so
it is never confused with your personal key:

```bash
sudo -u deploy ssh-keygen -t ed25519 -N "" -C "github-actions-deploy" -f /home/deploy/.ssh/gh_deploy
```

Install the public half and lock the permissions down — sshd silently ignores
`authorized_keys` if the modes are too loose:

```bash
mkdir -p /home/deploy/.ssh
cat /home/deploy/.ssh/gh_deploy.pub >> /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

---

## Step 5 — Put the private key in GitHub

```bash
cat /home/deploy/.ssh/gh_deploy
```

Copy the output **in full**, including the `-----BEGIN OPENSSH PRIVATE KEY-----` and
`-----END OPENSSH PRIVATE KEY-----` lines and the trailing newline. A truncated key
fails with a confusing handshake error rather than a clear one.

GitHub → repo **Settings → Secrets and variables → Actions**:

1. **New repository secret** → name `VPS_SSH_KEY` → paste → save.
2. Confirm `VPS_HOST` is still present and correct.

**Leave `VPS_PASSWORD` in place for now.** It is your rollback if Step 6 fails. You
delete it in Step 8, once the key-based deploy is proven.

---

## Step 6 — Test the new path before locking anything down

From your still-open root session:

```bash
sudo -u deploy ssh -i /home/deploy/.ssh/gh_deploy -o StrictHostKeyChecking=accept-new deploy@localhost 'whoami && cd /var/www/architmittal.com && git status --short'
```

Should print `deploy` and a clean status.

Then merge the prepared auth change and trigger the real thing:

```bash
git checkout main && git merge deploy-auth-hardening && git push
```

GitHub → **Actions → Deploy to VPS → Run workflow** (`workflow_dispatch` is already
enabled). Watch it go green before continuing.

**Do not proceed to Step 7 until that workflow run succeeds.** If it fails, revert the
merge — the old root/password path still works until you delete `VPS_PASSWORD` in Step 5.

---

## Step 7 — Disable password auth and root login

Only after Step 6 is green. Keep your root session open.

```bash
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

Set these in `/etc/ssh/sshd_config` (edit existing lines rather than appending
duplicates — the *first* occurrence wins):

```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
```

Check for overrides that would silently defeat this — cloud images often ship one:

```bash
grep -rE "PasswordAuthentication|PermitRootLogin" /etc/ssh/sshd_config /etc/ssh/sshd_config.d/ 2>/dev/null
```

Validate, then reload:

```bash
sshd -t && systemctl reload sshd
```

`sshd -t` must print nothing. If it reports an error, fix it before reloading — a
reload with a broken config can drop the listener entirely.

Now, **in a brand-new terminal while the old session stays open**, confirm you can still
get in with your own key. Only close the original session once that works.

Since root can no longer log in directly, make sure your personal user can escalate:

```bash
usermod -aG sudo yourusername   # if not already
```

---

## Step 8 — Retire the password

Only after Steps 6 and 7 both pass.

GitHub → **Settings → Secrets and variables → Actions** → delete **`VPS_PASSWORD`**.

Then rotate the root password on the VPS, since it sat in GitHub secrets and may appear
in workflow logs from before this change:

```bash
passwd root
```

---

## Verification checklist

- [ ] `sudo -u deploy git -C /var/www/architmittal.com status` works
- [ ] `pm2 list` shows `architmittal-website` under the expected user
- [ ] Manual `workflow_dispatch` run goes green
- [ ] `https://architmittal.com` returns 200 after that run
- [ ] `VPS_PASSWORD` deleted from GitHub secrets
- [ ] Root password rotated
- [ ] New SSH session works after the sshd reload
- [ ] `ssh root@<host>` is now refused
- [ ] Password login is refused:
      `ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no deploy@<host>`

---

## Rollback

If a deploy breaks and you need the old behaviour temporarily, revert the two changed
lines in `.github/workflows/deploy.yml` (`username: root`, `password: ${{ secrets.VPS_PASSWORD }}`)
and re-add the `VPS_PASSWORD` secret. Do not leave it that way — it is the configuration
this runbook exists to remove.
