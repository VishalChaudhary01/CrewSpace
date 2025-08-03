import request from "supertest";

import { createServer } from "@/create-server";

describe("GET /health", () => {
  it("should response with ok", async () => {
    const app = createServer();
    const { status, body } = await request(app).get("/health");

    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
  });
});
