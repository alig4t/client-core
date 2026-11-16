import { CoreProvider, EntityDetail } from "@/core/entity";
import {
  UserChannelDefinition,
  UserChannelLookups,
} from "./UserChannel.definition";
import service from "./UserChannelService";
import { entityExtension } from "../UserChannel.extension";
export default function UserChannelDisplay() {
  return (
    <CoreProvider value={{ lookups: UserChannelLookups }}>
      <EntityDetail
        definition={UserChannelDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
