import type { BaseModel } from "@/core/models/BaseModel";

export interface CityModel extends BaseModel {
  cityName: string;
  country: string;
}
