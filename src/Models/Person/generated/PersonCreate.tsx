import { CoreProvider, EntityForm } from "@/core/entity";
import { PersonDefinition, PersonLookups } from "./Person.definition";
import service from "./PersonService";
import { entityExtension } from "../Person.extension";
export default function PersonCreate() {
  return (
    <CoreProvider value={{ lookups: PersonLookups }}>
      <EntityForm
        definition={PersonDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
