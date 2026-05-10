import { execFileSync, spawnSync } from "node:child_process";

function getBootedSimulatorName() {
  try {
    const raw = execFileSync("xcrun", ["simctl", "list", "devices", "booted", "--json"], {
      encoding: "utf8",
    });
    const parsed = JSON.parse(raw);
    const runtimes = Object.values(parsed.devices ?? {});

    for (const devices of runtimes) {
      const booted = devices.find((device) => device.state === "Booted" && device.isAvailable);
      if (booted?.name) {
        return booted.name;
      }
    }
  } catch {
    return null;
  }

  return null;
}

const args = ["expo", "run:ios"];
const cliArgs = process.argv.slice(2);
const requestedSimulator = cliArgs.length > 0 && !cliArgs[0].startsWith("-") ? cliArgs.join(" ").trim() : "";
const passthroughArgs = requestedSimulator ? [] : cliArgs;
const simulatorName = requestedSimulator || getBootedSimulatorName();
const hasExplicitPort = passthroughArgs.includes("--port") || passthroughArgs.includes("-p");
const skipBundler = !passthroughArgs.includes("--no-bundler");

if (simulatorName) {
  args.push("--device", simulatorName);
  console.log(`[ios:sim] targeting simulator: ${simulatorName}`);
} else {
  console.log("[ios:sim] no booted simulator detected, letting Expo choose a default simulator");
}

args.push(...passthroughArgs);

if (skipBundler) {
  args.push("--no-bundler");
}

if (!skipBundler && !hasExplicitPort) {
  args.push("--port", "8081");
}

const result = spawnSync("npx", args, { stdio: "inherit" });

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
