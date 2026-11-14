# makefun-coin-launch-01

An entry for the make.fun bounty **"Race to launch a real coin on Solana"**:
an agent launches a real coin on pump.fun, and this repository hands in the
mint and the signature of the transaction that created it. Places go by when
the coin was created on chain, earliest first; the 100 fastest launches
share $1,000.

## The coin

- Launched on pump.fun inside the window (opens 2026-11-14 00:30 UTC,
  closes 2026-11-15 00:30 UTC), by the agent, with no human step.
- Name: `make.fun ghost`, symbol: `GHOST`.
- Logo: make.fun's ghost mascot, unmodified, from the press kit at
  https://make.fun/press (`mark-1024.png`, sha256
  `96ba54c48b6d8ea5bbfa4f199f0a2da1bd27b312a1094309c71f0bc02e0f8725`).
- Token metadata description contains the exact sentence:
  `made for make.fun $1000 bounty`.
- Signing / payout wallet:
  `4AMjUwVXnUN4YCxZRRHJvP1547sxveye3VjTJ9W1mhA8`.

## What is in this repository

- `main.ts` — the entrypoint (Node 22, standard library only). It copies
  `LAUNCH.json` from the repository root to `/output/LAUNCH.json` and
  reads it back to confirm it is a JSON object with string `mint` and
  `create_signature` fields. That is all it does: no network, no clock, so
  two runs write the same bytes.
- `LAUNCH.json` — the coin's mint and the base58 signature of the
  transaction that created it. Until the coin is launched it holds
  placeholders; the launch script replaces both values with the real ones.
- `launch-coin.mjs` — the ready-to-run launch procedure, kept in the work
  directory (not in this repo). It uploads the metadata, builds the
  pump.fun `create` transaction, simulates it first, sends it, and writes
  the mint + signature into `LAUNCH.json`. It is only run once the wallet
  is funded and the launch is approved.
- `COSTS.md` — the exact SOL the launch needs, itemised from pump.fun's
  own fee page and live Solana rent figures.
- `.makefun/owner.json` — the claim file naming the signing wallet.
- `LICENSE` — MIT.

## Run the entrypoint locally

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/LAUNCH.json` is then byte for byte this directory's `LAUNCH.json`.

## Launch (needs funding + approval first)

The wallet currently holds 0 SOL, so no launch has happened yet. Once it
is funded (see `COSTS.md`, about 0.05 SOL is more than enough) and the
launch is approved:

```sh
cd ~/workspace/make-fun/makefun-coin-launch-01
node launch-coin.mjs --dry-run   # exact cost, no send
node launch-coin.mjs --confirm   # sends the real create transaction
```

It refuses to run if the balance is short, simulates the transaction
before sending anything, and only then writes the real mint and signature
into `LAUNCH.json`. After that, re-run the entrypoint check above and
submit the new commit before the deadline.
