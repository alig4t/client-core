import { CoreProvider, EntityForm } from "@/core/entity";
import { BotDefinition, BotLookups } from "./Bot.definition";
import service from "./BotService";
import { entityExtension } from "../Bot.extension";
export default function BotCreate() {
  return (
    <CoreProvider value={{ lookups: BotLookups }}>
      <EntityForm
        definition={BotDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
