export interface ICategory {
    id: number;
    name: string;
}

export interface ITag {
    id: number;
    name: string;
}

export interface IPost {
    id: number;
    title: {
        rendered: string;
    };
}

