import { CoreProvider, EntityDetail } from "@/core/entity";
import { KeywordDefinition, KeywordLookups } from "./Keyword.definition";
import service from "./KeywordService";
import { entityExtension } from "../Keyword.extension";
export default function KeywordDisplay() {
  return (
    <CoreProvider value={{ lookups: KeywordLookups }}>
      <EntityDetail
        definition={KeywordDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
