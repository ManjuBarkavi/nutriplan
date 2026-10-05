import { Router, type IRouter } from "express";
import { db, syncStatesTable } from "@workspace/db";
import { GetSyncStateParams, PutSyncStateBody, PutSyncStateParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/sync/:syncId", async (req, res) => {
  const params = GetSyncStateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid sync code" });
    return;
  }
  const [row] = await db
    .select()
    .from(syncStatesTable)
    .where(eq(syncStatesTable.id, params.data.syncId));
  if (!row) {
    res.status(404).json({ error: "Nothing stored for this sync code" });
    return;
  }
  res.json({ state: row.state, updatedAt: row.updatedAt.toISOString() });
});

router.put("/sync/:syncId", async (req, res) => {
  const params = PutSyncStateParams.safeParse(req.params);
  const body = PutSyncStateBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid sync code or body" });
    return;
  }
  const updatedAt = new Date();
  const [row] = await db
    .insert(syncStatesTable)
    .values({ id: params.data.syncId, state: body.data.state, updatedAt })
    .onConflictDoUpdate({
      target: syncStatesTable.id,
      set: { state: body.data.state, updatedAt },
    })
    .returning();
  res.json({ state: row.state, updatedAt: row.updatedAt.toISOString() });
});

export default router;
