import { CoreProvider, EntityForm } from "@/core/entity";
import {
  MessagingPlatformDefinition,
  MessagingPlatformLookups,
} from "./MessagingPlatform.definition";
import service from "./MessagingPlatformService";
import { entityExtension } from "../MessagingPlatform.extension";
export default function MessagingPlatformCreate() {
  return (
    <CoreProvider value={{ lookups: MessagingPlatformLookups }}>
      <EntityForm
        definition={MessagingPlatformDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
