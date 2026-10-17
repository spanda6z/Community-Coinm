import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const address = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
  const rpc = process.env.SOLANA_RPC_URL;
  if (!address || !rpc) {
    return NextResponse.json({ configured: false, activity: [], message: "Treasury address and Solana RPC are not configured." }, { status: 503 });
  }
  try {
    const treasury = new PublicKey(address);
    const connection = new Connection(rpc, "confirmed");
    const signatures = await connection.getSignaturesForAddress(treasury, { limit: 25 }, "confirmed");
    const transactions = await connection.getParsedTransactions(signatures.map(item => item.signature), { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
    const activity = transactions.flatMap((tx, index) => {
      const item = signatures[index];
      if (!tx || tx.meta?.err || !tx.meta) return [];
      const keys = tx.transaction.message.accountKeys.map(key => key.pubkey.toBase58());
      const i = keys.indexOf(treasury.toBase58());
      if (i < 0) return [];
      const delta = (tx.meta.postBalances[i] ?? 0) - (tx.meta.preBalances[i] ?? 0);
      if (delta === 0) return [];
      const time = tx.blockTime ?? item.blockTime;
      return [{
        signature: item.signature,
        direction: delta > 0 ? "in" : "out",
        asset: "SOL",
        amount: (Math.abs(delta) / 1e9).toLocaleString("en-US", { maximumFractionDigits: 9 }),
        confirmedAt: time ? new Date(time * 1000).toISOString() : null,
        explorerUrl: "https://explorer.solana.com/tx/" + item.signature
      }];
    });
    return NextResponse.json({
      configured: true, treasuryAddress: treasury.toBase58(), activity,
      source: "Solana RPC", commitment: "confirmed", fetchedAt: new Date().toISOString(),
      note: "Shows net native SOL balance changes only. SPL token transfers and multisig approvals are not included."
    }, { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" } });
  } catch {
    return NextResponse.json({ configured: true, activity: [], message: "Could not read confirmed treasury transactions. Verify the address and RPC endpoint." }, { status: 502 });
  }
}
