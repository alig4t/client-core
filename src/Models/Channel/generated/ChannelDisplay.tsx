import { CoreProvider, EntityDetail } from "@/core/entity";
import { ChannelDefinition, ChannelLookups } from "./Channel.definition";
import service from "./ChannelService";
import { entityExtension } from "../Channel.extension";
export default function ChannelDisplay() {
  return (
    <CoreProvider value={{ lookups: ChannelLookups }}>
      <EntityDetail
        definition={ChannelDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
