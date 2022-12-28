import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  return res;
};

export const config = {
  matcher: '/roodddm/:path*',
};
