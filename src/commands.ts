import { readConfig, setUser } from 'src/config.js';
import { createUser, deleteUsers, getUser, getUsers } from 'src/lib/db/queries/users.js';
import { fetchFeed, RSSItem } from './feed';

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Please provide the name");
    }

    //check if user exists
    const user = args[0]
    const checkUsers = await getUser(user);
    if (checkUsers === undefined) {
        throw new Error(`User '${user}' doesn't exist`);
    }

    setUser(user);
    console.log(`User "${user}" has been set.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Please provide the name");
    }
    const user = args[0]

    //check if user exists
    const checkUsers = await getUser(user);
    if (checkUsers !== undefined) {
        throw new Error(`User already exists: ${checkUsers.name}`);
    }

    const newUser = await createUser(user);
    setUser(user);
    console.log(`User "${user}" was created: ${newUser}`);
}

export async function handlerReset(cmdName: string, ...args: string[]) {

    await deleteUsers();
    console.log(`All Users deleted`);
}

export async function handlerUsers(cmdName: string, ...args: string[]) {

    const config = readConfig();
    const currentUser = config.currentUserName;

    const result = await getUsers();
    for (let i = 0; i < result.length; i++) {
        if (result[i].name === currentUser) {
            console.log(`* ${result[i].name} (current)`);
        } else {
            console.log(`* ${result[i].name}`);
        }
    }
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    //console.log(feed);
    for (let i = 0; i < feed.channel.item.length; i++) {
        console.log(feed.channel.item[i]);
    }
}

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}