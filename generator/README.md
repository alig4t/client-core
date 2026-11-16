# Frontend generator

Generates typed entity definitions, response/create/update contracts and thin CRUD pages using the shared React core. The normalized contract lives in `src/core/entity`; templates reuse that runtime instead of duplicating form and table logic.

## Setup and commands

From the repository root (CI uses Node.js 22):

```bash
npm ci
npm --prefix generator ci
npm run generator:build
npm run generate -- Product --dry-run
npm run generate -- Product
npm run generate:all
npm run generate:check
```

Direct CLI, including a custom configuration:

```bash
node generator/dist/index.js generate Product --config generator/config.json
node generator/dist/index.js generate:all --config generator/config.json --dry-run
node generator/dist/index.js generate:all --config generator/config.json --check
```

`--dry-run` validates and lists changes without writing. `--check` also exits unsuccessfully when output is stale. Parse, formatting, graph or type errors fail the command before output is replaced. Rebuild the CLI after editing generator sources.

## Define an entity

Add `Product.xml` under the configured entityDefinitions directory:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<entity>
  <name>Product</name>
  <generate>true</generate>
  <fields>
    <field>
      <name>title</name>
      <type>STRING</type>
      <required>true</required>
      <searchable>true</searchable>
      <minLength>3</minLength>
    </field>
    <field><name>amount</name><type>BIG_DECIMAL</type></field>
    <field><name>active</name><type>BOOLEAN</type></field>
  </fields>
</entity>
```

Optional `Product.meta.yaml`:

```yaml
displayName: محصول
displayNamePlural: محصولات
autocompleteField: title
endpoint: /products
idType: string
routing:
  basePath: /dashboard/products
  menuLabel: محصولات
  menuIcon: Package
  showInMenu: true
fields:
  title:
    label: نام محصول
    sortable: true
  amount:
    label: قیمت
  active:
    label: فعال
    defaultValue: false
operations:
  update:
    method: patch
```

Metadata merges per field; missing metadata keeps XML constraints and defaults. Unknown fields, invalid XML/types, missing relation targets and invalid display fields fail validation. XML scalar types are STRING, INTEGER, LONG, DOUBLE, BIG_DECIMAL, BOOLEAN, DATE, LOCAL_DATE, LOCAL_DATE_TIME and ENUM. See `entity-definitions/ComprehensiveEntity.xml` and its YAML for enum and relationship examples.

Relationships support ONE_TO_ONE, MANY_TO_ONE, ONE_TO_MANY and MANY_TO_MANY. A document relationship uses the upload control. Relations use references by default; `relation.valueMode: id` opts into scalar IDs. Override relation display labels, endpoint and dependent lookup filters in YAML `relationships`. Nested owned structures can be declared with object/array metadata and child `fields`.

LONG and BIG_DECIMAL default to strings to preserve precision. DATE is an instant, LOCAL_DATE is date-only and LOCAL_DATE_TIME is a local datetime. Calendar display is independent of wire formats. Keep backend serializers consistent with these contracts.

## Configuration

Paths resolve relative to the configuration file, including templates. `paths` controls definitions, output, core, menu, router and project root. Type checking uses `paths.projectRoot/tsconfig.app.json`; the application's aliases must resolve configured paths.

`generation` controls formatting, route registration, permissions, overwrite and type checking. Type checking is enabled by default. Keep it enabled for application output. With `overwriteExisting: false`, differing owned files are reported as preserved. Existing wrappers and extension files are always retained.

`coreEntities` maps existing entities to their model import, service import, endpoint and display field. Their configured services power generated lookups. Keep these imports pointed at real application modules. `fieldTypeMapping` controls compatible scalar representations, including numeric versus string LONG/decimal. `formTypeMapping` controls supported widgets; metadata may override the widget without replacing the domain type.

## Ownership and extension points

Managed implementations live in `Models/<Entity>/generated/`. Root wrappers and `<Entity>.extension.ts` are created only when absent. Generated routes, viewnames and permissions are registered centrally; menu entries are merged with existing manual configuration.

`Models/.generator-manifest.json` records managed file hashes, normalizing line endings. Manual edits to an owned file cause generation to stop. Put custom field configuration in `definitionOverrides` and services, transforms, actions or renderers in `entityExtension`; replace a root wrapper for custom page behavior.

Output is planned and type checked in memory before writing. Each changed file is replaced through a temporary file; write failures restore previous contents. Two identical generations produce no changes. Removing an entity or disabling a generation option does not delete existing modules or registries; remove obsolete application references explicitly.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run generator:build
npm run generate:check
npm run build
npm run test:e2e
```

Fixtures cover boolean-only and to-many-only entities, absent/partial metadata, quoted labels, type-correct output, option handling, edited-file protection and repeatable generation. See the [Persian core guide](../docs/CORE_GUIDE.fa.md) for runtime contracts and application adapters.
