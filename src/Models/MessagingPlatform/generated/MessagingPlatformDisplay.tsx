import { CoreProvider, EntityDetail } from "@/core/entity";
import {
  MessagingPlatformDefinition,
  MessagingPlatformLookups,
} from "./MessagingPlatform.definition";
import service from "./MessagingPlatformService";
import { entityExtension } from "../MessagingPlatform.extension";
export default function MessagingPlatformDisplay() {
  return (
    <CoreProvider value={{ lookups: MessagingPlatformLookups }}>
      <EntityDetail
        definition={MessagingPlatformDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
