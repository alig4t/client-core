import { CoreProvider, EntityDetail } from "@/core/entity";
import {
  DashboardDataDefinition,
  DashboardDataLookups,
} from "./DashboardData.definition";
import service from "./DashboardDataService";
import { entityExtension } from "../DashboardData.extension";
export default function DashboardDataDisplay() {
  return (
    <CoreProvider value={{ lookups: DashboardDataLookups }}>
      <EntityDetail
        definition={DashboardDataDefinition}
        service={service}
        {...entityExtension}
      />
    </CoreProvider>
  );
}
