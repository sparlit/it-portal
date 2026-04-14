import { NextRequest, NextResponse } from 'next/server';

/**
 * Logs out the current session and returns a success JSON response.
 *
 * Deletes the `session` cookie from the response and returns a JSON body of `{ success: true }`.
 *
 * @returns A Response whose body is the JSON object `{ success: true }` and that has the `session` cookie removed.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  return response;
}
