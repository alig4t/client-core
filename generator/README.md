# RNT Social API - Frontend Code Generator

Generates complete CRUD components for React frontend from XML entity definitions.

## 🎯 Features

- ✅ Generates 9 files per entity (Model, Meta, Service, Page, Table, Columns, Create, Display, Search)
- ✅ Supports all field types (STRING, INTEGER, ENUM, DATE, etc.)
- ✅ Supports all relationship types (ONE_TO_ONE, MANY_TO_ONE, ONE_TO_MANY, MANY_TO_MANY)
- ✅ Persian/Farsi UI labels and metadata
- ✅ Core entity detection (User, Document, etc.)
- ✅ Automatic enum file generation
- ✅ Prettier code formatting
- ✅ Fully configurable via `config.json`

## 📦 Installation

```bash
cd generator
npm install
npm run build
```

## 🚀 Usage

### Generate Single Entity

```bash
npm run generate -- generate Channel
```

### Generate All Entities

```bash
npm run generate:all
```

### Development Mode (with live reload)

```bash
npm run dev generate Channel
```

## 📁 Project Structure

```
generator/
├── config.json              # Configuration file
├── entity-definitions/      # XML + Meta files
│   ├── Channel.xml
│   ├── Channel.meta.yaml
│   ├── ComprehensiveEntity.xml
│   └── ComprehensiveEntity.meta.yaml
├── src/
│   ├── index.ts            # CLI entry point
│   ├── config.ts           # Config loader
│   ├── parsers/
│   │   ├── XmlParser.ts    # XML → Entity
│   │   └── MetaParser.ts   # YAML → Metadata
│   ├── generators/
│   │   └── FrontendGenerator.ts  # Main generator
│   ├── templates/          # Handlebars templates
│   │   ├── Model.hbs
│   │   ├── ModelMeta.hbs
│   │   ├── Service.hbs
│   │   ├── Page.hbs
│   │   ├── Table.hbs
│   │   ├── TableColumns.hbs
│   │   ├── Create.hbs
│   │   ├── Display.hbs
│   │   └── Search.hbs
│   ├── types/
│   │   └── EntityTypes.ts  # TypeScript types
│   └── utils/
│       ├── EntityMerger.ts     # XML + Meta merger
│       └── TemplateHelpers.ts  # Handlebars helpers
└── README.md
```

## ⚙️ Configuration

Edit `config.json` to customize:

### Paths
- `entityDefinitions`: Where XML/meta files are located
- `outputBase`: Where generated files go (`../src/Models`)
- `coreComponents`: Core components path
- `menuConfig`: Menu configuration file

### Core Entities
Define which entities are "core" (pre-existing):

```json
"coreEntities": {
  "User": {
    "isCore": true,
    "importPath": "@/core/models/User",
    "servicePath": "@/core/services/UserService"
  }
}
```

### Generation Options
```json
"generation": {
  "formatWithPrettier": true,
  "generateRoutes": true,
  "generatePermissions": true,
  "overwriteExisting": false
}
```

## 📝 Creating Entities

### Step 1: Copy XML from Backend

```bash
# From backend repo
cp rnt-social-api-main/src/main/resources/generate-xmls/Channel.xml \
   ../frontend-repo/generator/entity-definitions/
```

### Step 2: Create Meta File

Create `Channel.meta.yaml`:

```yaml
displayName: کانال
displayNamePlural: کانال‌ها
autocompleteField: channelName

routing:
  basePath: /dashboard/portal/channels
  menuLabel: کانال‌ها
  menuIcon: MessageSquare
  menuParent: /dashboard/portal
  showInMenu: true

fields:
  channelName:
    label: نام کانال
    placeholder: نام کانال را وارد کنید
    sortable: true

  status:
    label: وضعیت
    sortable: true
    enums:
      ACTIVE: فعال
      INACTIVE: غیرفعال

relationships:
  platform:
    label: پلتفرم
    type: autocomplete
    displayField: platformName
```

### Step 3: Generate

```bash
npm run generate -- generate Channel
```

### Step 4: Update Routes

The generated files need to be added to your routes. See generated output for imports.

## 🔧 Field Type Support

| Backend Type | TypeScript Type | Form Component |
|-------------|-----------------|----------------|
| STRING | string | FormInput (text) |
| INTEGER | number | FormInput (number) |
| LONG | number | FormInput (number) |
| DOUBLE | number | FormInput (number) |
| BIG_DECIMAL | string | FormInput (number) |
| BOOLEAN | boolean | Checkbox |
| DATE | string | DateInput |
| LOCAL_DATE | string | DateInput |
| LOCAL_DATE_TIME | string | DateInput |
| ENUM | string | FormSelect |

## 🔗 Relationship Support

| Type | Form Component | Example |
|------|----------------|---------|
| ONE_TO_ONE | FormAutoComplete | User selection |
| MANY_TO_ONE | FormAutoComplete | Channel selection |
| ONE_TO_MANY | FormAutoComplete (multi) | Keywords |
| MANY_TO_MANY | FormAutoComplete (multi) | Messages |

## 🎨 Generated Files

For entity `Channel`, generates:

1. **ChannelModel.ts** - TypeScript interface
2. **ChannelModel.meta.ts** - UI metadata
3. **ChannelService.ts** - API service
4. **ChannelPage.tsx** - List page
5. **ChannelTable.tsx** - Data table wrapper
6. **ChannelTableColumns.tsx** - Table row rendering
7. **ChannelCreate.tsx** - Create/Edit form
8. **ChannelDisplay.tsx** - Detail view
9. **ChannelSearch.tsx** - Search/filter form

Plus enum files if entity has enum fields.

## 🚨 Core Entity Handling

Core entities (User, Document, etc.) are imported from core instead of generated:

```typescript
// Non-core
import type { ChannelModel } from "@/Models/Channel/ChannelModel";

// Core
import type { User } from "@/core/models/User";
```

Configure in `config.json` > `coreEntities`.

## 🐛 Troubleshooting

### Template Errors
Check Handlebars syntax in `src/templates/*.hbs`

### Missing Meta File
Generator will use defaults if `.meta.yaml` not found (with warning)

### Type Errors
Ensure all relationships reference existing entities or are marked as core

### Overwrite Protection
Set `overwriteExisting: true` in config to replace existing files

## 📚 Examples

See `entity-definitions/` for:
- `Channel.meta.yaml` - Simple entity
- `ComprehensiveEntity.meta.yaml` - Complex entity with all features

## 🤝 Contributing

To modify templates:
1. Edit `src/templates/*.hbs`
2. Rebuild: `npm run build`
3. Test: `npm run generate -- generate TestEntity`

## 📄 License

Internal tool for RNT Social API project.
