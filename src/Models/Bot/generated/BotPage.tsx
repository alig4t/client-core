import { CoreProvider, EntityList } from "@/core/entity";
import { BotDefinition, BotLookups } from "./Bot.definition";
import service from "./BotService";
import { entityExtension } from "../Bot.extension";
export default function BotPage() {
  return (
    <CoreProvider value={{ lookups: BotLookups }}>
      <EntityList
        definition={BotDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
