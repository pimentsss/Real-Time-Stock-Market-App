import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/better-auth/auth";

const handler = async (req: Request) => {
  const auth = await getAuth();
  const { GET, POST } = toNextJsHandler(auth.handler);
  return req.method === "POST" ? POST(req) : GET(req);
};

export { handler as GET, handler as POST };
