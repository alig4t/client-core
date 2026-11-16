import { CoreProvider, EntityList } from "@/core/entity";
import { PersonDefinition, PersonLookups } from "./Person.definition";
import service from "./PersonService";
import { entityExtension } from "../Person.extension";
export default function PersonPage() {
  return (
    <CoreProvider value={{ lookups: PersonLookups }}>
      <EntityList
        definition={PersonDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
