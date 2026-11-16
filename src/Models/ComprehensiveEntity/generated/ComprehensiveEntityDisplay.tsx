import { CoreProvider, EntityDetail } from "@/core/entity";
import {
  ComprehensiveEntityDefinition,
  ComprehensiveEntityLookups,
} from "./ComprehensiveEntity.definition";
import service from "./ComprehensiveEntityService";
import { entityExtension } from "../ComprehensiveEntity.extension";
export default function ComprehensiveEntityDisplay() {
  return (
    <CoreProvider value={{ lookups: ComprehensiveEntityLookups }}>
      <EntityDetail
        definition={ComprehensiveEntityDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
