import type { BaseModel } from "@/core/models/BaseModel";

export interface CityModel extends BaseModel<number> {
  cityName: string;
  country: string;
}
export interface CityCreateInput {
  cityName: string;
  country: string;
}
export interface CityUpdateInput {
  cityName?: string;
  country?: string;
}
