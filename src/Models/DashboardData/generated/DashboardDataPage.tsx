import { CoreProvider, EntityList } from "@/core/entity";
import {
  DashboardDataDefinition,
  DashboardDataLookups,
} from "./DashboardData.definition";
import service from "./DashboardDataService";
import { entityExtension } from "../DashboardData.extension";
export default function DashboardDataPage() {
  return (
    <CoreProvider value={{ lookups: DashboardDataLookups }}>
      <EntityList
        definition={DashboardDataDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
