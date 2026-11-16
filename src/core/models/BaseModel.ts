import type { EntityId } from "../service/contracts";
export interface BaseModel<TId extends EntityId = number> {
  id: TId;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null; // Can be optional or nullable
}
