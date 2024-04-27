#! /usr/bin/env node
import { fileURLToPath } from "url";
import { Command } from "commander";
import sortedObject from "sorted-object";
import path from "path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, "..");
const MODE_0666 = parseInt("0666", 8);
// const { version } = import("../package.json");
// const VERSION = version;

const program = new Command();
program
  .name("create-express-template-ts")
  .version("1.0.0")
  .helpOption("-h, --help", "Display help for command")
  .arguments("[Project-Name]", "Project name")
  .action((projectName) => {
    if (!projectName) {
      console.error("Please provide a project name.");
      return;
    }

    const createdDirectory = createDirectory(projectName);
    if (!createdDirectory) {
      return;
    }
    try {
      createApplication(createdDirectory, createdDirectory);
      showNextSteps(createdDirectory);
    } catch (err) {
      console.error("Something wrong happened while creating the template.");
    }
  });

program.parse(process.argv);
/**
 * Display the version.
 */

// function version() {
//   console.log(VERSION);
// }

/**
 * Show next steps to the user
 *
 * @param {string} name
 * @param {string} dir
 *
 */

function showNextSteps(name, dir) {
  console.log("ProjectProject name: " + dir);
  const prompt = launchedFromCmd() ? ">" : "$";

  if (dir !== ".") {
    console.log();
    console.log("   change directory:");
    console.log("     %s cd %s", prompt, dir);
  }

  console.log();
  console.log("   install dependencies:");
  console.log("     %s npm install", prompt);
  console.log();
  console.log("   run the app:");
  console.log("     npm run dev", prompt, name);
  console.log();
}

/**
 * Create application at the given directory.
 *
 * @param {string} name
 * @param {string} dir
 * @param {object} options
 * @param {function} done
 */

function createApplication(name, dir) {
  console.log();

  console.log("name: " + name + " dir: " + dir);

  // Package
  var pkg = {
    name: name,
    version: "1.0.0",
    type: "module",
    private: true,
    main: "src/index.ts",
    engines: {
      node: "20.11.1",
      npm: "10.2.4",
    },
    scripts: {
      "start:without:dotenv": "tsx --env-file .env src/index.ts",
      "dev:without:dotenv": "tsx watch --env-file .env src",
      "prod:without:dotenv": "node  --env-file .env dist/index.js",
      build: "tsc",
      start: "tsx dist/src/index.js",
      dev: "tsx watch src/index.ts",
      linter: "npx eslint src",
      "prettier:check": "npx prettier . --check",
      "prettier:write": "npx prettier . --write",
      prepare: "husky",
      test: "jest",
      "test:watch": "jest --watch",
      "test:coverage": "jest --coverage",
    },
    dependencies: {
      dotenv: "^16.4.5",
      express: "^4.19.1",
      helmet: "^7.1.0",
      "http-status-codes": "^2.3.0",
      uuid: "^9.0.1",
      winston: "^3.12.0",
      zod: "^3.22.4",
    },
    devDependencies: {
      "@types/express": "^4.17.21",
      "@types/jest": "^29.5.12",
      "@types/node": "^20.11.30",
      "@types/supertest": "^6.0.2",
      "@types/uuid": "^9.0.8",
      eslint: "^8.57.0",
      "eslint-config-prettier": "^9.1.0",
      husky: "^9.0.11",
      jest: "^29.7.0",
      "lint-staged": "^15.2.2",
      prettier: "3.2.5",
      supertest: "^6.3.4",
      "ts-jest": "^29.1.2",
      tsx: "^4.7.1",
      typescript: "^5.4.3",
      "typescript-eslint": "^7.4.0",
    },
    "lint-staged": {
      "**/*": ["eslint", "npm run prettier:write"],
    },
  };

  pkg.dependencies = sortedObject(pkg.dependencies);

  fs.mkdirSync(dir + "/src");
  fs.mkdirSync(dir + "/src/controllers");
  fs.mkdirSync(dir + "/src/controllers/__Test__");
  fs.mkdirSync(dir + "/src/routes");
  fs.mkdirSync(dir + "/src/schemas");
  fs.mkdirSync(dir + "/src/services");
  fs.mkdirSync(dir + "/src/utils");
  fs.mkdirSync(dir + "/mockData");

  copyTemplateMulti(".", dir);
  copyTemplateMulti("src", dir + "/src");
  copyTemplateMulti("src/controllers", dir + "/src/controllers");
  copyTemplateMulti(
    "src/controllers/__Test__",
    dir + "/src/controllers/__Test__",
  );
  copyTemplateMulti("src/routes", dir + "/src/routes");
  copyTemplateMulti("src/schemas", dir + "/src/schemas");
  copyTemplateMulti("src/services", dir + "/src/services");
  copyTemplateMulti("src/utils", dir + "/src/utils");
  copyTemplateMulti("mockData", dir + "/mockData");

  write(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

  console.log("Template generated successfully");
}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

function createAppName(pathName) {
  return path
    .basename(pathName)
    .replace(/[^A-Za-z0-9.-]+/g, "-")
    .replace(/^[-_.]+|-+$/g, "")
    .toLowerCase();
}

/**
 * Create project directory.
 *
 * @param {String} projectName
 */

function createDirectory(projectName) {
  // Create the project directory
  const validatedDirectory = createAppName(path.resolve(projectName));

  if (fs.existsSync(projectName)) {
    console.error(`The directory ${validatedDirectory} already exists`);
    return false;
  }

  try {
    fs.mkdirSync(validatedDirectory);
    console.log(`The directory ${validatedDirectory} was created`);
    return validatedDirectory;
  } catch (e) {
    console.error(
      `Something wrong happened. Please check the projectName and try again`,
    );
    return false;
  }
}

function isFile(pathName) {
  try {
    const stats = fs.statSync(pathName);
    if (stats.isFile()) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error something wrong happened:", err);
    return false;
  }
}

function isDirectory(pathName) {
  try {
    const stats = fs.statSync(pathName);
    if (stats.isDirectory()) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error something wrong happened:", err);
    return false;
  }
}

/**
 * echo str > file.
 *
 * @param {String} file
 * @param {String} str
 */

function write(file, str, mode) {
  fs.writeFileSync(file, str, { mode: mode || MODE_0666 });
  console.log("   \x1b[36mcreate\x1b[0m : " + file);
}

/**
 * Copy file from template directory.
 */

function copyTemplate(from, to) {
  if (isFile(from)) {
    console.log("from:, " + from + "to: ", to);
    write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), "utf-8"));
  }
}

/**
 * Copy multiple files from template directory.
 */

function copyTemplateMulti(fromDir, toDir) {
  fs.readdirSync(path.join(TEMPLATE_DIR, fromDir)).forEach(function (name) {
    copyTemplate(path.join(fromDir, name), path.join(toDir, name));
  });
}

/**
 * Check if the given directory `dir` is empty.
 *
 * @param {String} dir
 * @param {Function} fn
 */

function emptyDirectory(dir, fn) {
  fs.readdir(dir, function (err, files) {
    if (err && err.code !== "ENOENT") throw err;
    fn(!files || !files.length);
  });
}

/**
 * Display an error.
 *
 * @param {String} message
 */

function error(message) {
  console.error();
  message.split("\n").forEach(function (line) {
    console.error("  error: %s", line);
  });
  console.error();
}

/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
  return process.platform === "win32" && process.env._ === undefined;
}

/**
 * Load template file.
 */

function loadTemplate(name) {
  var contents = fs.readFileSync(
    path.join(__dirname, "..", "templates", name + ".ejs"),
    "utf-8",
  );
  var locals = Object.create(null);

  function render() {
    return ejs.render(contents, locals, {
      escape: util.inspect,
    });
  }

  return {
    locals: locals,
    render: render,
  };
}

/**
 * Make the given dir relative to base.
 *
 * @param {string} base
 * @param {string} dir
 */

// function mkdir(base, dir) {
//   var loc = path.join(base, dir);

//   console.log("   \x1b[36mcreate\x1b[0m : " + loc + path.sep);
//   mkdirp.sync(loc, MODE_0755);
// }
