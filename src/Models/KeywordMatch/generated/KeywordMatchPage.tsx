import { CoreProvider, EntityList } from "@/core/entity";
import {
  KeywordMatchDefinition,
  KeywordMatchLookups,
} from "./KeywordMatch.definition";
import service from "./KeywordMatchService";
import { entityExtension } from "../KeywordMatch.extension";
export default function KeywordMatchPage() {
  return (
    <CoreProvider value={{ lookups: KeywordMatchLookups }}>
      <EntityList
        definition={KeywordMatchDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
