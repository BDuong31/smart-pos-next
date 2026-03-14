export interface ICategory {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryCreate {
  name: string;
  parentId?: string | null;
}

export interface ICategoryUpdate {
  name?: string;
  parentId?: string | null;
}


