import { CoreProvider, EntityForm } from "@/core/entity";
import { MessageDefinition, MessageLookups } from "./Message.definition";
import service from "./MessageService";
import { entityExtension } from "../Message.extension";
export default function MessageCreate() {
  return (
    <CoreProvider value={{ lookups: MessageLookups }}>
      <EntityForm
        definition={MessageDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
