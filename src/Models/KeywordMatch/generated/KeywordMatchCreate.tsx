import { CoreProvider, EntityForm } from "@/core/entity";
import {
  KeywordMatchDefinition,
  KeywordMatchLookups,
} from "./KeywordMatch.definition";
import service from "./KeywordMatchService";
import { entityExtension } from "../KeywordMatch.extension";
export default function KeywordMatchCreate() {
  return (
    <CoreProvider value={{ lookups: KeywordMatchLookups }}>
      <EntityForm
        definition={KeywordMatchDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
