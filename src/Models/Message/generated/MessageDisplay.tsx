import { CoreProvider, EntityDetail } from "@/core/entity";
import { MessageDefinition, MessageLookups } from "./Message.definition";
import service from "./MessageService";
import { entityExtension } from "../Message.extension";
export default function MessageDisplay() {
  return (
    <CoreProvider value={{ lookups: MessageLookups }}>
      <EntityDetail
        definition={MessageDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
