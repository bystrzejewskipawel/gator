import { CommandHandler } from "./commands.js";
import { User } from "./schema.js";
import { getUser } from "./lib/db/queries/users.js";
import { readConfig } from "./config.js";

//export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;
export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    
    return async (cmdNameFromCLI: string, ...argsFromCLI: string[]): Promise<void> => {
        const config = readConfig();
        const currentUser: User = await getUser(config.currentUserName);

        if (!currentUser) {
            throw new Error(`User ${config.currentUserName} not found`);
        }
        await handler(cmdNameFromCLI, currentUser, ...argsFromCLI);
    };

};