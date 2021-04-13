export interface ListResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;

    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

interface TimeStampable {
    readonly created_at: string;
    readonly deleted_at: string | null;
    readonly updated_at : string;
} 

export interface Category extends TimeStampable {
   readonly id: string;
    name: string;
    description: string;
    is_active: boolean;
}

export interface CastMember  extends TimeStampable {
    readonly id: string;
    name: string;
    type: number;
}

export interface Genre extends TimeStampable {
    readonly id: string;
    name: string;
    is_active: boolean;
    categories: Category[];
}