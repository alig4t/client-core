# Template Import Fixes Needed

Based on Comprehensive example, here are all the import corrections:

## Create.hbs

**Wrong:**
```typescript
import { Validator } from "@/core/forms/validation";
import { FormInput } from "@/core/components/form/FormInput";
import { createMessages } from "@/core/forms/MessageUtils";
```

**Correct:**
```typescript
import Validator from "@/core/forms/validation";
import FormInput from "@/core/components/form/FormInput";
import z from "@/core/forms/zod.config";
import { publicMessages } from "@/core/forms/MessageUtils";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { getViewPath } from "@/core/router/RouteUtils";
```

## Display.hbs

**Wrong:**
```typescript
import RecordDisplayLayout from "@/core/components/general/container/RecordDisplayLayout";
import { TablePlaceholder } from "@/core/components/Table/TablePlaceholder";
import { TableErrorState } from "@/core/components/Table/TableErrorState";
```

**Correct:**
```typescript
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import TableErrorState from "@/core/components/general/TableErrorState";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { getViewPath } from "@/core/router/RouteUtils";
```

## Search.hbs

**Wrong:**
```typescript
import { FormInput } from "@/core/components/form/FormInput";
import { FilterOperators } from "@/core/forms/FilterOperators";
```

**Correct:**
```typescript
import FormInput from "@/core/components/form/FormInput";
import { FilterOperator } from "@/core/forms/FilterOperators";
import z from "@/core/forms/zod.config";
import Validator from "@/core/forms/validation";
```

## Page.hbs

**Needs:**
```typescript
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
```

And Breadcrumb component needs:
```typescript
<Breadcrumb items={breadcrumbItems} />
```

## Other Issues:

1. **Breadcrumb** - needs `items` prop from `useBreadcrumbs()`
2. **Button variant** - "outline" might not be valid, check ButtonVariant type
3. **Enum syntax** - `export enum` might have issues, use `export const enum` or type alias
4. **FormAutoComplete** - `displayField` prop might not exist
5. **Messages** - use `publicMessages` not `createMessages`
6. **User import** - Missing in config.json coreEntities
