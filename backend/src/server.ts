import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import { schema } from "./schema.js";
import { authenticateRequest } from "./middleware/auth.js";

const yoga = createYoga({
  schema,
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
  context: async ({ request }) => {
    const auth = await authenticateRequest(request);

    return {
      auth,
    };
  },
});

const server = createServer(yoga);
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}/graphql`);
});
