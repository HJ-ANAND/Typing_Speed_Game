import { GraphQLError } from "graphql";
export function validateGameResult(input) {
    const { completionTime, correctCharacters, wrongAttempts, penaltyTime, } = input;
    if (!Number.isFinite(completionTime) || completionTime <= 0) {
        throw new GraphQLError("Completion time must be greater than 0", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
    if (!Number.isInteger(correctCharacters) ||
        correctCharacters < 0) {
        throw new GraphQLError("Correct characters must be a non-negative integer", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
    if (!Number.isInteger(wrongAttempts) || wrongAttempts < 0) {
        throw new GraphQLError("Wrong attempts must be a non-negative integer", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
    if (!Number.isFinite(penaltyTime) || penaltyTime < 0) {
        throw new GraphQLError("Penalty time cannot be negative", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
}
