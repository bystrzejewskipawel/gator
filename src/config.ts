import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(user: string) {
    const config: Config = {dbUrl: "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable", currentUserName: user}
    fs.writeFileSync(getConfigPath(), JSON.stringify(config));
};

export function readConfig(): Config {
    const file = fs.readFileSync(getConfigPath(), 'utf-8');
    const config: Config = JSON.parse(file);
    return config;
}

function getConfigPath(): string {
    return os.homedir() + "/.gatorconfig.json"
}