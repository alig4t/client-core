import type { BaseModel } from "@/core/models/BaseModel";
import type { User } from "@/core/models/User";
import type { CityModel } from "@/Models/City/CityModel";

export interface PersonModel extends BaseModel {
  firstName: string;
  lastName: string;
  nationalId?: string;
  birthDate?: string;
  coreUser: User;
  city?: CityModel;
}
