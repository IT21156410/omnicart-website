export interface Category {
    id: string;
    name: string;
    isActive: boolean;
    image?: string;
}

export type CreateCategoryData = Partial<Category>


export type UpdateCategoryData = Partial<Category>