import { CoreProvider, EntityList } from "@/core/entity";
import { ChannelDefinition, ChannelLookups } from "./Channel.definition";
import service from "./ChannelService";
import { entityExtension } from "../Channel.extension";
export default function ChannelPage() {
  return (
    <CoreProvider value={{ lookups: ChannelLookups }}>
      <EntityList
        definition={ChannelDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
