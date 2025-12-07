import 'src/config.js';
import { CommandsRegistry, registerCommand, handlerLogin, runCommand, handlerRegister, handlerReset, handlerUsers, handlerAgg, handlerAddFeed, handlerFeeds, handlerFollow, handlerFollowing } from 'src/commands.js';
import os from "os";
import { getUser } from './lib/db/queries/users.js';

async function main() {

  const cr: CommandsRegistry = {};
  await registerCommand(cr, "login", handlerLogin);
  await registerCommand(cr, "register", handlerRegister);
  await registerCommand(cr, "reset", handlerReset);
  await registerCommand(cr, "users", handlerUsers);
  await registerCommand(cr, "agg", handlerAgg);
  await registerCommand(cr, "addfeed", handlerAddFeed);
  await registerCommand(cr, "feeds", handlerFeeds);
  await registerCommand(cr, "follow", handlerFollow);
  await registerCommand(cr, "following", handlerFollowing);

  const args = process.argv.slice(2);

  // if (args.length < 2) {
  //   console.error("Too few arguments provided");
  //   process.exit(1);
  // }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    await runCommand(cr, cmdName, ...cmdArgs)
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }

  process.exit(0);

}

await main();