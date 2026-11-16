import { CoreProvider, EntityDetail } from "@/core/entity";
import { CityDefinition, CityLookups } from "./City.definition";
import service from "./CityService";
import { entityExtension } from "../City.extension";
export default function CityDisplay() {
  return (
    <CoreProvider value={{ lookups: CityLookups }}>
      <EntityDetail
        definition={CityDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
