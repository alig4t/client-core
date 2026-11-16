import { CoreProvider, EntityList } from "@/core/entity";
import {
  UserChannelDefinition,
  UserChannelLookups,
} from "./UserChannel.definition";
import service from "./UserChannelService";
import { entityExtension } from "../UserChannel.extension";
export default function UserChannelPage() {
  return (
    <CoreProvider value={{ lookups: UserChannelLookups }}>
      <EntityList
        definition={UserChannelDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
