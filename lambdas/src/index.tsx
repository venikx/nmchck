import { Hono } from "hono";
import type { LambdaEvent, LambdaContext } from "hono/aws-lambda";
import { handle } from "hono/aws-lambda";

import { Home } from "./views/Home";

export type Bindings = {
  event: LambdaEvent;
  lambdaContext: LambdaContext;
};
const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.html(<Home />));
app.all("*", (c) => c.json({ message: "Route not found" }, 404));

export const handler = handle(app);
