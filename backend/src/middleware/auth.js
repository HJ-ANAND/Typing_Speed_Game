import { GraphQLError } from "graphql";
import { verifyAuthToken } from "../auth/token.js";
export async function authenticateRequest(request) {
    const authorization = request.headers.get("authorization");
    if (!authorization) {
        return null;
    }
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
        return null;
    }
    try {
        const { userId } = await verifyAuthToken(token);
        return {
            userId,
        };
    }
    catch {
        throw new GraphQLError("Invalid or expired authentication token", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }
}
