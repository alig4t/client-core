import type { BaseModel } from "@/core/models/BaseModel";

import type { CityModel } from "@/Models/City/CityModel";
import type { UserModel } from "../User/UserModel";

export interface PersonModel extends BaseModel {
  firstName: string;
  lastName: string;
  nationalId?: string;
  birthDate?: string;
  coreUser: UserModel;
  city?: CityModel;
}
