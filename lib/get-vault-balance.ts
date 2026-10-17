import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export type VaultBalance = {
  address: string;
  sol: number;
  solFormatted: string;
  lamports: number;
  ok: boolean;
  error?: string;
  fetchedAt: string;
};

const DEFAULT_TREASURY =
  "21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP";

function rpcUrl() {
  return (
    process.env.SOLANA_RPC_URL ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com"
  );
}

export function treasuryAddress() {
  return process.env.NEXT_PUBLIC_TREASURY_ADDRESS || DEFAULT_TREASURY;
}

/** Live SOL balance for the community vault wallet. */
export async function getVaultBalance(): Promise<VaultBalance> {
  const address = treasuryAddress();
  const fetchedAt = new Date().toISOString();
  try {
    const connection = new Connection(rpcUrl(), "confirmed");
    const pubkey = new PublicKey(address);
    const lamports = await connection.getBalance(pubkey);
    const sol = lamports / LAMPORTS_PER_SOL;
    return {
      address,
      sol,
      solFormatted: sol.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }),
      lamports,
      ok: true,
      fetchedAt,
    };
  } catch (e) {
    return {
      address,
      sol: 0,
      solFormatted: "—",
      lamports: 0,
      ok: false,
      error: e instanceof Error ? e.message : "RPC error",
      fetchedAt,
    };
  }
}
