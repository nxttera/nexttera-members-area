import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  if (!event.path.startsWith("/api")) {
    return;
  }

  const url = getRequestURL(event);
  const method = event.method;
  const headers = getHeaders(event);
  const body = event.method === "GET" ? {} : await readBody(event);

  console.log(`[${method}] ${url}`);
  console.log("Headers:", JSON.stringify(headers, null, 2));
  console.log("Body:", JSON.stringify(body, null, 2));
  console.log("--------------------------------");
});
