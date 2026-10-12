import { readFile, readdir, stat, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const lock = JSON.parse(
  await readFile(new URL("package-lock.json", root), "utf8"),
);
const fiberNotice = await readFile(
  new URL("licenses/fiber-9.8.1.txt", import.meta.url),
  "utf8",
);
const apacheNotice = await readFile(
  new URL("licenses/apache-2.0.txt", import.meta.url),
  "utf8",
);
const mitTerms = fiberNotice.replace(/^Copyright.*\n/m, "");
const output = [
  "RepoCity third-party dependency notices",
  "Conservative inventory of all non-dev lockfile packages; some are not present in the tree-shaken browser bundle.",
  "Asset license: public/kit/License.txt. No observed repository data is included here.",
];
let count = 0;
for (const [path, entry] of Object.entries(lock.packages).sort(([a], [b]) =>
  a < b ? -1 : a > b ? 1 : 0,
)) {
  if (!path || entry.dev) continue;
  const directory = new URL(`${path}/`, root);
  const pkg = JSON.parse(
    await readFile(new URL("package.json", directory), "utf8"),
  );
  output.push(
    `\n========== ${pkg.name} ${entry.version} (${pkg.license ?? entry.license ?? "see notice"}) ==========`,
  );
  const files = [];
  for (const name of await readdir(directory))
    if (
      /^(licen[sc]e|copying|notice)/i.test(name) &&
      (await stat(new URL(name, directory))).isFile()
    )
      files.push(name);
  for (const name of files.sort())
    output.push(
      `\n--- ${name} ---\n${await readFile(new URL(name, directory), "utf8")}`,
    );
  if (!files.length) {
    if (pkg.author)
      output.push(
        `Author (package metadata): ${typeof pkg.author === "string" ? pkg.author : JSON.stringify(pkg.author)}`,
      );
    if (pkg.name === "@react-three/fiber")
      output.push(
        "Versioned upstream notice: https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.8.1/LICENSE",
        fiberNotice,
      );
    else if (pkg.license === "MIT")
      output.push(
        "Package declares MIT; no standalone notice is shipped. Standard MIT terms:",
        mitTerms,
      );
    else if (pkg.license === "Apache-2.0")
      output.push(
        "Package declares Apache-2.0; no standalone notice is shipped. Standard Apache terms:",
        apacheNotice,
      );
    else throw new Error(`License text requires review: ${pkg.name}`);
  }
  count++;
}
await writeFile(
  new URL("public/THIRD_PARTY_NOTICES.txt", root),
  output.join("\n").replace(/\r\n/g, "\n").trimEnd() + "\n",
);
console.log(`Preserved dependency notices for ${count} lockfile packages.`);
