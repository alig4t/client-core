import type Handlebars from "handlebars";
export function registerHelpers(engine: typeof Handlebars) {
  const pascal = (value: string) =>
    value
      .replace(/[-_](.)/g, (_, char: string) => char.toUpperCase())
      .replace(/^./, (char) => char.toUpperCase());
  engine.registerHelper("pascalCase", pascal);
  engine.registerHelper(
    "camelCase",
    (value: string) => value[0].toLowerCase() + value.slice(1),
  );
  engine.registerHelper("kebabCase", (value: string) =>
    value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
  );
  engine.registerHelper("snakeCase", (value: string) =>
    value.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase(),
  );
  engine.registerHelper("lowercase", (value: string) => value.toLowerCase());
  engine.registerHelper("isRelationship", (value: string) =>
    ["ONE_TO_ONE", "ONE_TO_MANY", "MANY_TO_ONE", "MANY_TO_MANY"].includes(
      value,
    ),
  );
  engine.registerHelper("isToOne", (value: string) =>
    ["ONE_TO_ONE", "MANY_TO_ONE"].includes(value),
  );
  engine.registerHelper("isToMany", (value: string) =>
    ["ONE_TO_MANY", "MANY_TO_MANY"].includes(value),
  );
  engine.registerHelper(
    "isEnum",
    (value: unknown) =>
      typeof value === "object" &&
      value !== null &&
      "type" in value &&
      value.type === "ENUM",
  );
  engine.registerHelper("eq", (a: unknown, b: unknown) => a === b);
  engine.registerHelper("ne", (a: unknown, b: unknown) => a !== b);
  engine.registerHelper("and", (...values: unknown[]) =>
    values.slice(0, -1).every(Boolean),
  );
  engine.registerHelper("or", (...values: unknown[]) =>
    values.slice(0, -1).some(Boolean),
  );
  engine.registerHelper("json", (value: unknown) =>
    JSON.stringify(value, null, 2),
  );
  engine.registerHelper(
    "getTsType",
    (value: string, array: boolean) =>
      (({
        STRING: "string",
        INTEGER: "number",
        LONG: "string",
        DOUBLE: "number",
        BIG_DECIMAL: "string",
        BOOLEAN: "boolean",
        DATE: "string",
        LOCAL_DATE: "string",
        LOCAL_DATE_TIME: "string",
        ENUM: "string",
      })[value] ?? "unknown") + (array ? "[]" : ""),
  );
}
