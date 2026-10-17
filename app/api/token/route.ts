import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
export const dynamic = "force-dynamic";
export async function GET() {
  const mint = process.env.NEXT_PUBLIC_TOKEN_MINT;
  const rpc = process.env.SOLANA_RPC_URL;
  if (!mint || !rpc) return NextResponse.json({ configured: false, message: "Token mint and Solana RPC are not configured. Live token data is unavailable." }, { status: 503 });
  try {
    const mintKey = new PublicKey(mint);
    const connection = new Connection(rpc, "confirmed");
    const [supply, largest] = await Promise.all([connection.getTokenSupply(mintKey), connection.getTokenLargestAccounts(mintKey)]);
    return NextResponse.json({
      configured: true,
      mint: mintKey.toBase58(),
      supply: { amount: supply.value.amount, decimals: supply.value.decimals, uiAmount: supply.value.uiAmountString },
      largestAccounts: largest.value.slice(0, 10).map((item) => ({ address: item.address.toBase58(), amount: item.amount, decimals: item.decimals, uiAmount: item.uiAmountString })),
      source: "Solana RPC",
      commitment: "confirmed",
      fetchedAt: new Date().toISOString(),
      note: "Largest token accounts are not the same as unique holder counts; market price requires a separate trusted market-data integration.",
    }, { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" } });
  } catch {
    return NextResponse.json({ configured: true, error: "Unable to read token data from configured Solana RPC. Check the mint address and RPC endpoint." }, { status: 502 });
  }
}
