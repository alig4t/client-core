import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { XmlEntityParser } from "../parsers/XmlParser.js";
import { loadConfig } from "../config.js";
export function addTypesToYamlFiles(directory: string) {
  const config = loadConfig(),
    parser = new XmlEntityParser();
  for (const file of readdirSync(directory).filter((file) =>
    file.endsWith(".xml"),
  )) {
    const target = join(directory, file.replace(/\.xml$/, ".meta.yaml"));
    if (!existsSync(target)) continue;
    const entity = parser.parseFile(join(directory, file));
    const data = yaml.load(readFileSync(target, "utf8")) as {
      fields?: Record<string, { type?: string }>;
      relationships?: Record<string, { type?: string }>;
    };
    for (const field of entity.fields)
      if (data.fields?.[field.name] && !data.fields[field.name].type)
        data.fields[field.name].type = config.formTypeMapping[field.type];
    for (const relation of entity.relationships)
      if (
        data.relationships?.[relation.name] &&
        !data.relationships[relation.name].type
      )
        data.relationships[relation.name].type = relation.document
          ? "File"
          : "autocomplete";
    writeFileSync(
      target,
      yaml.dump(data, { lineWidth: 120, noRefs: true }),
      "utf8",
    );
  }
}
if (process.argv[1]?.includes("AddTypesToYaml"))
  addTypesToYamlFiles(
    process.argv[2] ?? join(process.cwd(), "entity-definitions"),
  );
