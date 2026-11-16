import { CoreProvider, EntityDetail } from "@/core/entity";
import { PersonDefinition, PersonLookups } from "./Person.definition";
import service from "./PersonService";
import { entityExtension } from "../Person.extension";
export default function PersonDisplay() {
  return (
    <CoreProvider value={{ lookups: PersonLookups }}>
      <EntityDetail
        definition={PersonDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
