import api from "../lib/api.ts";

export interface Author{
    name: string;
    bio: string;
    country:string;
    age:number;
}

export interface Publisher{
    name: string;
    country: string;
}
export interface Book{
    id:string;
    name:string;
    price:number;
    stock:number;
    author:Author;
    publisher:Publisher;
}
export const getAllBooks = async () : Promise<Book[]> => {
    const response = await api.get<Book[]>("/Books/getAll");
    return response.data;
}

export const getBookByName = async (name: string) : Promise<Book | null> => {
    const response = await api.get<Book>(`/Books/${name}`);
    return response.data;
}