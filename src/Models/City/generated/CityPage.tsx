import { CoreProvider, EntityList } from "@/core/entity";
import { CityDefinition, CityLookups } from "./City.definition";
import service from "./CityService";
import { entityExtension } from "../City.extension";
export default function CityPage() {
  return (
    <CoreProvider value={{ lookups: CityLookups }}>
      <EntityList
        definition={CityDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
