import { CoreProvider, EntityForm } from "@/core/entity";
import {
  ComprehensiveEntityDefinition,
  ComprehensiveEntityLookups,
} from "./ComprehensiveEntity.definition";
import service from "./ComprehensiveEntityService";
import { entityExtension } from "../ComprehensiveEntity.extension";
export default function ComprehensiveEntityCreate() {
  return (
    <CoreProvider value={{ lookups: ComprehensiveEntityLookups }}>
      <EntityForm
        definition={ComprehensiveEntityDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
