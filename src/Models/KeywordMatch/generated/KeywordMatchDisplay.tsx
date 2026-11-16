import { CoreProvider, EntityDetail } from "@/core/entity";
import {
  KeywordMatchDefinition,
  KeywordMatchLookups,
} from "./KeywordMatch.definition";
import service from "./KeywordMatchService";
import { entityExtension } from "../KeywordMatch.extension";
export default function KeywordMatchDisplay() {
  return (
    <CoreProvider value={{ lookups: KeywordMatchLookups }}>
      <EntityDetail
        definition={KeywordMatchDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
