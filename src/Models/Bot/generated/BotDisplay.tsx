import { CoreProvider, EntityDetail } from "@/core/entity";
import { BotDefinition, BotLookups } from "./Bot.definition";
import service from "./BotService";
import { entityExtension } from "../Bot.extension";
export default function BotDisplay() {
  return (
    <CoreProvider value={{ lookups: BotLookups }}>
      <EntityDetail
        definition={BotDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
