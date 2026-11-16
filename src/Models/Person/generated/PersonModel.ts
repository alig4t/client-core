import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { UserModel } from "@/Models/User/UserModel";
import type { CityModel } from "@/Models/City/CityModel";
export interface PersonModel extends BaseModel<number> {
  firstName: string;
  lastName: string;
  nationalId?: string;
  birthDate?: string;
  coreUser: UserModel;
  city?: CityModel;
}
export interface PersonCreateInput {
  firstName: string;
  lastName: string;
  nationalId?: string;
  birthDate?: string;
  coreUser: { id: EntityId };
  city?: { id: EntityId };
}
export interface PersonUpdateInput {
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  birthDate?: string;
  coreUser?: { id: EntityId };
  city?: { id: EntityId };
}
