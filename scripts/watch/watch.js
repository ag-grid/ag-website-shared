/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Watch nx dev environments in a queue
 *
 * Use `nx` to watch projects, batch up the changes, and update `BUILD_QUEUE_EMPTY_FILE`
 * once the changes settle down. This ensures multiple updates triggered in parallel get
 * batched up into one update event. Watching `BUILD_QUEUE_EMPTY_FILE` in another process
 * can be used to trigger further updates eg, website refresh.
 *
 * Usage: node ./watch [charts|grid]
 */
const { spawn } = require('child_process');
const fs = require('node:fs/promises');
const { QUIET_PERIOD_MS, BATCH_LIMIT, PROJECT_ECHO_LIMIT, NX_ARGS, BUILD_QUEUE_EMPTY_FILE } = require('./constants');
const chartsConfig = require('./chartsWatch.config');
const gridConfig = require('./gridWatch.config');

const RED = '\x1b[;31m';
const GREEN = '\x1b[;32m';
const YELLOW = '\x1b[;33m';
const RESET = '\x1b[m';

function success(msg, ...args) {
    console.log(`*** ${GREEN}${msg}${RESET}`, ...args);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function warning(msg, ...args) {
    console.log(`*** ${YELLOW}${msg}${RESET}`, ...args);
}
function error(msg, ...args) {
    console.log(`*** ${RED}${msg}${RESET}`, ...args);
}

const spawnedChildren = new Set();

function spawnNxWatch(outputCb) {
    let exitResolve, exitReject;
    const exitPromise = new Promise((resolve, reject) => {
        exitResolve = resolve;
        exitReject = reject;
    });

    const nxWatch = spawn('nx', [...NX_ARGS, ...'watch --all -- echo ${NX_PROJECT_NAME}'.split(' ')]);
    spawnedChildren.add(nxWatch);
    nxWatch.on('error', (e) => {
        console.error(e);
        exitReject(e);
    });
    nxWatch.on('exit', () => {
        spawnedChildren.delete(nxWatch);
        exitResolve();
    });
    nxWatch.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const project of lines) {
            if (project.trim().length === 0) continue;

            outputCb(project);
        }
    });

    return exitPromise;
}

function spawnNxRun(target, config, projects) {
    let exitResolve, exitReject;
    const exitPromise = new Promise((resolve, reject) => {
        exitResolve = resolve;
        exitReject = reject;
    });

    const nxRunArgs = [...NX_ARGS, 'run-many', '-t', target];
    if (config != null) {
        nxRunArgs.push('-c', config);
    }
    nxRunArgs.push('-p', ...projects);

    success(`Executing: nx ${nxRunArgs.join(' ')}`);
    const nxRun = spawn(`nx`, nxRunArgs, { stdio: 'inherit', env: process.env });
    spawnedChildren.add(nxRun);
    nxRun.on('error', (e) => {
        console.error(e);
        exitReject(e);
    });
    nxRun.on('exit', (code) => {
        spawnedChildren.delete(nxRun);
        if (code === 0) {
            exitResolve();
        } else {
            exitReject();
        }
    });

    return exitPromise;
}

let timeout;
function scheduleBuild() {
    if (buildBuffer.length > 0) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => build(), QUIET_PERIOD_MS);
    }
}

let buildBuffer = [];
function processWatchOutput({ project: rawProject, getProjectBuildTargets }) {
    if (rawProject === '') return;

    for (const [project, targets, config] of getProjectBuildTargets(rawProject)) {
        for (const target of targets) {
            buildBuffer.push([project, config, target]);
        }
    }

    scheduleBuild();
}

let buildRunning = false;
async function build() {
    if (buildRunning) return;
    buildRunning = true;

    const [, config, target] = buildBuffer.at(0);
    const newBuildBuffer = [];
    const projects = new Set();
    for (const next of buildBuffer) {
        if (projects.size < BATCH_LIMIT && next[2] === target && next[1] === config) {
            projects.add(next[0]);
        } else {
            newBuildBuffer.push(next);
        }
    }
    buildBuffer = newBuildBuffer;

    let targetMsg = [...projects.values()].slice(0, PROJECT_ECHO_LIMIT).join(' ');
    if (projects.size > PROJECT_ECHO_LIMIT) {
        targetMsg += ` (+${projects.size - PROJECT_ECHO_LIMIT} targets)`;
    }
    try {
        success(`Starting build for: ${targetMsg}`);
        await spawnNxRun(target, config, [...projects.values()]);
        success(`Completed build for: ${targetMsg}`);
        success(`Build queue has ${buildBuffer.length} remaining.`);

        if (buildBuffer.length === 0) {
            await touchBuildQueueEmptyFile();
        }
    } catch (e) {
        error(`Build failed for: ${targetMsg}: ${e}`);
    } finally {
        buildRunning = false;
        scheduleBuild();
    }
}

async function touchBuildQueueEmptyFile() {
    try {
        const time = new Date();
        await fs.utimes(BUILD_QUEUE_EMPTY_FILE, time, time);
    } catch (err) {
        if ('ENOENT' !== err.code) {
            throw err;
        }
        const fh = await fs.open(BUILD_QUEUE_EMPTY_FILE, 'a');
        await fh.close();
    }
}

const CONSECUTIVE_RESPAWN_THRESHOLD_MS = 500;
async function run(config) {
    const { ignoredProjects, getProjectBuildTargets } = config;

    let lastRespawn;
    let consecutiveRespawns = 0;
    while (true) {
        lastRespawn = Date.now();
        success('Starting watch...');
        await spawnNxWatch((project) => {
            if (ignoredProjects.includes(project)) return;

            processWatchOutput({ project, getProjectBuildTargets });
        });

        if (Date.now() - lastRespawn < CONSECUTIVE_RESPAWN_THRESHOLD_MS) {
            consecutiveRespawns++;
        } else {
            consecutiveRespawns = 0;
        }

        if (consecutiveRespawns > 5) {
            respawnError();
            return;
        }

        await waitMs(1_000);
    }
}

function respawnError() {
    error(`Repeated respawn detected!
        
    The Nx Daemon maybe erroring, try restarting it to resolve with either:
    - \`nx daemon --stop\`
    - \`yarn\`

    Or alternatively view its logs at:
    - .nx/cache/d/daemon.log
`);
}

function waitMs(timeMs) {
    let resolveWait;
    setInterval(() => resolveWait(), timeMs);
    return new Promise((r) => (resolveWait = r));
}

process.on('beforeExit', () => {
    for (const child of spawnedChildren) {
        child.kill();
    }
    spawnedChildren.clear();
});

const library = process.argv[2];
if (!['charts', 'grid'].includes(library)) {
    const msg = 'Invalid library to watch. Options: charts, grid';
    error(msg);
    throw new Error(msg);
}
const config = library === 'charts' ? chartsConfig : gridConfig;
run(config);
