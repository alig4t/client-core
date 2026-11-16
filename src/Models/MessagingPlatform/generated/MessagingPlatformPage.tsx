import { CoreProvider, EntityList } from "@/core/entity";
import {
  MessagingPlatformDefinition,
  MessagingPlatformLookups,
} from "./MessagingPlatform.definition";
import service from "./MessagingPlatformService";
import { entityExtension } from "../MessagingPlatform.extension";
export default function MessagingPlatformPage() {
  return (
    <CoreProvider value={{ lookups: MessagingPlatformLookups }}>
      <EntityList
        definition={MessagingPlatformDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
