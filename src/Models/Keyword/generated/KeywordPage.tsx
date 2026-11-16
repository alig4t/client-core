import { CoreProvider, EntityList } from "@/core/entity";
import { KeywordDefinition, KeywordLookups } from "./Keyword.definition";
import service from "./KeywordService";
import { entityExtension } from "../Keyword.extension";
export default function KeywordPage() {
  return (
    <CoreProvider value={{ lookups: KeywordLookups }}>
      <EntityList
        definition={KeywordDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
