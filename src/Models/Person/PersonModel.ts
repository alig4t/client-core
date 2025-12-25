import type { BaseModel } from "@/core/models/BaseModel";
import type { UserModel } from "@/Models/User/UserModel";
import type { CityModel } from "@/Models/City/CityModel";

export interface PersonModel extends BaseModel {
  firstName: string;
  lastName: string;
  nationalId?: string;
  birthDate?: string;
  coreUser: UserModel;
  city?: CityModel;
}
