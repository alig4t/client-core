import { CoreProvider, EntityForm } from "@/core/entity";
import { KeywordDefinition, KeywordLookups } from "./Keyword.definition";
import service from "./KeywordService";
import { entityExtension } from "../Keyword.extension";
export default function KeywordCreate() {
  return (
    <CoreProvider value={{ lookups: KeywordLookups }}>
      <EntityForm
        definition={KeywordDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
