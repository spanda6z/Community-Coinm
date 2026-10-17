import { NextResponse } from "next/server";
import { getVaultBalance } from "../../../lib/get-vault-balance";

export const dynamic = "force-dynamic";

export async function GET() {
  const balance = await getVaultBalance();
  return NextResponse.json(
    {
      ...balance,
      purpose: "marketing and airdrops",
      yield: false,
      note: "Voluntary contributions only. Not an investment product.",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}
