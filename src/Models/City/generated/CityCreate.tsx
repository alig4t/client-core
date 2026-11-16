import { CoreProvider, EntityForm } from "@/core/entity";
import { CityDefinition, CityLookups } from "./City.definition";
import service from "./CityService";
import { entityExtension } from "../City.extension";
export default function CityCreate() {
  return (
    <CoreProvider value={{ lookups: CityLookups }}>
      <EntityForm
        definition={CityDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
