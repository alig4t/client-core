// types/Document.ts
export interface DocumentModel {
    id: number;
    path: string | null;
    size: number;
    type: string; // e.g., "IMAGE"
    mimeType: string;
    extension: string;
    hash: string;
    scope: string;
    createdAt: string;
    updatedAt: string;
  }