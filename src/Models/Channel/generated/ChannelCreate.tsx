import { CoreProvider, EntityForm } from "@/core/entity";
import { ChannelDefinition, ChannelLookups } from "./Channel.definition";
import service from "./ChannelService";
import { entityExtension } from "../Channel.extension";
export default function ChannelCreate() {
  return (
    <CoreProvider value={{ lookups: ChannelLookups }}>
      <EntityForm
        definition={ChannelDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
