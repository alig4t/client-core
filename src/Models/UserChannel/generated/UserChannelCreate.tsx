import { CoreProvider, EntityForm } from "@/core/entity";
import {
  UserChannelDefinition,
  UserChannelLookups,
} from "./UserChannel.definition";
import service from "./UserChannelService";
import { entityExtension } from "../UserChannel.extension";
export default function UserChannelCreate() {
  return (
    <CoreProvider value={{ lookups: UserChannelLookups }}>
      <EntityForm
        definition={UserChannelDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
