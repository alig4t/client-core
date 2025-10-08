export interface BaseModel {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null; // Can be optional or nullable
}

// export interface BaseModel {
//     id: number;
//     createdAt: string;
//     updatedAt: string;
//     deletedAt: string;
// }