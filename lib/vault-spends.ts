/**
 * Manual vault spend log.
 * Add a row after every treasury spend (marketing / airdrop).
 * Link signature to Solscan or Explorer when available.
 */
export type VaultSpend = {
  id: string;
  date: string; // YYYY-MM-DD
  category: "marketing" | "airdrop" | "other";
  title: string;
  detail: string;
  amountLabel: string; // e.g. "0.5 SOL" or "TBD"
  txUrl?: string;
};

/** Official spends — update this list when the vault pays for something. */
export const VAULT_SPENDS: VaultSpend[] = [
  // Example template (remove or replace when real):
  // {
  //   id: "1",
  //   date: "2026-10-20",
  //   category: "marketing",
  //   title: "Raid kit + X boost",
  //   detail: "Creative pack and timed visibility push.",
  //   amountLabel: "0.4 SOL",
  //   txUrl: "https://solscan.io/tx/...",
  // },
];
