# What the launch costs (SOL)

Figures checked 14 Nov 2026 ~07:40 WIB against pump.fun's own fee page
(https://pump.fun/docs/fees, last updated 17 Oct 2026) and live Solana
rent-exemption figures from `api.mainnet-beta.solana.com`.

## The rule

pump.fun charges **no platform fee to create a coin** — "You pay only the
Solana network transaction fee and the small SOL deposit the network
requires to create the token's on-chain accounts." The old ~0.02 SOL
creation fee quoted by third-party guides no longer applies; the fee page
is the authority and it says 0.

## Itemised cost — create-only, no first buy

The bounty does not require a first buy, and a first buy is a purchase,
not a fee, so the launch script makes **no first buy**: the coin is
created with the `create` instruction alone.

| Item | Basis | SOL |
| --- | --- | --- |
| Platform creation fee | pump.fun fee page: none | 0 |
| Mint account rent | 82 bytes, rent-exempt minimum queried live: 1,066,800 lamports | 0.0010668 |
| Bonding-curve account rent | 49 bytes (verified: live pump.fun bonding-curve accounts are 49 bytes), minimum 899,160 lamports | 0.00089916 |
| Associated bonding-curve token-account rent | 165 bytes, minimum 1,488,440 lamports | 0.00148844 |
| Metadata account rent | Metaplex metadata account; size depends on the name/symbol/URI lengths. Dry-run of the launch script (URI length 60): 161 bytes, 1,468,120 lamports — the script queries the exact rent for the real URI length before sending | 0.00146812 |
| Base network fee | 5,000 lamports per signature | 0.000005 |
| Priority fee (cap) | Compute-unit price 1,000,000 microlamports × 200,000 CU limit = 200,000,000,000 microlamports max; actual is less, it scales with CU used | ≤ 0.0002 |
| First buy | Skipped — optional, not required | 0 |
| **Total** | Dry-run verified: 5,127,520 lamports (real URI length moves it by ≲ 0.0001 SOL) | **0.0051275 SOL** |

## How much to fund

**Fund 0.05 SOL.** The launch itself needs 0.0051275 SOL (dry-run verified,
real URI length moves it by ≲ 0.0001 SOL); 0.05 SOL leaves a wide margin for a priority-fee spike or a slightly larger
metadata account, and the unspent SOL stays in the wallet. It also covers
the separate ~0.0035 SOL the rules say to keep in the signing wallet for
a first escrow-claim transaction if the entry wins — that claim is paid
later, from the same wallet.

## What the launch script does before spending anything

`launch-coin.mjs` (in the work directory, not the submitted repo) refuses
to send unless the wallet balance covers the exact computed total, and it
simulates the transaction first. Run it with `--dry-run` to see the exact
figure for the real metadata URI before funding.
