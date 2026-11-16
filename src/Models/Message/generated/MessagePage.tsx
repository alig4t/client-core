import { CoreProvider, EntityList } from "@/core/entity";
import { MessageDefinition, MessageLookups } from "./Message.definition";
import service from "./MessageService";
import { entityExtension } from "../Message.extension";
export default function MessagePage() {
  return (
    <CoreProvider value={{ lookups: MessageLookups }}>
      <EntityList
        definition={MessageDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
