import { CoreProvider, EntityList } from "@/core/entity";
import {
  ComprehensiveEntityDefinition,
  ComprehensiveEntityLookups,
} from "./ComprehensiveEntity.definition";
import service from "./ComprehensiveEntityService";
import { entityExtension } from "../ComprehensiveEntity.extension";
export default function ComprehensiveEntityPage() {
  return (
    <CoreProvider value={{ lookups: ComprehensiveEntityLookups }}>
      <EntityList
        definition={ComprehensiveEntityDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
