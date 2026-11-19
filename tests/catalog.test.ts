import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { catalogEntries } from "../src/examples/core-ui/catalog/entries";

const root = process.cwd();
function files(directory: string): string[] {
  return readdirSync(path.join(root, directory), {
    withFileTypes: true,
  }).flatMap((item) => {
    const name = `${directory}/${item.name}`;
    return item.isDirectory() ? files(name) : [name];
  });
}
describe("component catalog coverage", () => {
  it("includes every component source and compatibility entry", () => {
    // These are usage demos themselves, rather than library components.
    const demos = new Set([
      "src/core/components/general/stepper/StepperDemo.tsx",
      "src/core/components/general/stepper/StepperExample.tsx",
    ]);
    const registered = new Set(
      catalogEntries.flatMap((entry) => [
        entry.source,
        ...(entry.aliases ?? []),
      ]),
    );
    for (const source of [
      ...files("src/core/components"),
      ...files("src/core/ui"),
    ].filter((name) => name.endsWith(".tsx") && !demos.has(name)))
      expect(
        registered.has(source),
        `No catalog example registered for ${source}`,
      ).toBe(true);
  });
  it("gives every example a unique ID, bilingual description, source and prop list", () => {
    expect(new Set(catalogEntries.map((entry) => entry.id)).size).toBe(
      catalogEntries.length,
    );
    for (const entry of catalogEntries) {
      expect(entry.description.fa.trim()).not.toBe("");
      expect(entry.description.en.trim()).not.toBe("");
      expect(entry.props.trim()).not.toBe("");
      expect(entry.Component).toBeTypeOf("function");
    }
  });
});
