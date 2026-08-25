import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import { schema } from "./schema.js";
import { authenticateRequest } from "./middleware/auth.js";

const yoga = createYoga({
  schema,

  context: async ({ request }) => {
    const auth = await authenticateRequest(request);

    return {
      auth,
    };
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
