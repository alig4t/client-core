import { CoreProvider, EntityForm } from "@/core/entity";
import {
  DashboardDataDefinition,
  DashboardDataLookups,
} from "./DashboardData.definition";
import service from "./DashboardDataService";
import { entityExtension } from "../DashboardData.extension";
export default function DashboardDataCreate() {
  return (
    <CoreProvider value={{ lookups: DashboardDataLookups }}>
      <EntityForm
        definition={DashboardDataDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
