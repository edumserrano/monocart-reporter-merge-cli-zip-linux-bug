import yargs from "yargs/yargs";
import z from "zod";

// Validating environment variables with zod
// - https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/

const _envSchema = z.object({
  CI: z
    .enum(["0", "1", "true", "false", "True", "False"])
    .catch("false")
    .transform((value) => value === "true" || value === "1" || value === "True"),
  USE_DOCKER_HOST_WEBSERVER: z
    .enum(["0", "1", "true", "false", "True", "False"])
    .catch("false")
    .transform((value) => value === "true" || value === "1" || value === "True"),
  INOTIFY_SUPPORT: z
    .enum(["0", "1", "true", "false", "True", "False"])
    .catch("false")
    .transform((value) => value === "true" || value === "1" || value === "True"),
  MINIMUM_REPORTERS_ONLY: z
    .enum(["0", "1", "true", "false", "True", "False"])
    .catch("false")
    .transform((value) => value === "true" || value === "1" || value === "True"),
});

export type PlaywrightEnv = z.infer<typeof _envSchema>;
const playwrightEnv: PlaywrightEnv = _envSchema.parse(process.env);

export type PlaywrightCliOptions = {
  ui: boolean;
  uiPort: number | null;
  uiHost: string | null;
  currentShard: number | null;
  maxShard: number | null;
  grep: string | null;
};

// See https://www.npmjs.com/package/yargs and https://github.com/yargs/yargs/blob/0c95f9c79e1810cf9c8964fbf7d139009412f7e7/docs/typescript.md
const parsedArgv = yargs(process.argv.slice(2))
  .options({
    ui: { type: "boolean", default: false },
    uiPort: { type: "number", default: null },
    uiHost: { type: "string", default: null },
    shard: { type: "string", default: null },
    grep: { type: "string", default: null },
  })
  .parseSync();
const playwrightCliOptions: PlaywrightCliOptions = {
  ui: parsedArgv.ui,
  uiPort: parsedArgv.uiPort,
  uiHost: parsedArgv.uiHost,
  grep: parsedArgv.grep,
  currentShard: Number(parsedArgv.shard?.split("/")[0]),
  maxShard: Number(parsedArgv.shard?.split("/")[1]),
};

export type PlaywrightTestCommand = {
  cliOptions: PlaywrightCliOptions;
  env: PlaywrightEnv;
  isInUIMode: boolean;
  isSharded: boolean;
  usesGrep: boolean;
};

export const playwrightTestCommand: PlaywrightTestCommand = {
  cliOptions: playwrightCliOptions,
  env: playwrightEnv,
  isInUIMode:
    playwrightCliOptions.ui || !!playwrightCliOptions.uiPort || !!playwrightCliOptions.uiHost,
  isSharded: !!playwrightCliOptions.currentShard,
  usesGrep: !!playwrightCliOptions.grep,
};
