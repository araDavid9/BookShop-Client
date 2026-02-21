import api from "../lib/api.ts";


export interface BookUpdateResponse{
    id: string;
}

export interface Author{
    name:string;
    bio:string;
    country:string;
    age:number
}

export interface Publisher{
    name:string;
    country:string;
}
export interface BookRequest {
    book: {
        name: string;
        price: number;
        stock: number;
    };
    author: Author;
    publisher: Publisher ;
}
export const  deleteBook = async (bookId :string):Promise<string> =>{
    const result = await api.get(`/books/Delete/${bookId}`);
    return result.data;
}

export const updateBook = async (bookRequest:BookRequest,bookId:string):Promise<BookUpdateResponse> =>{
    const result = await api.post(`/books/Update/${bookId}`, bookRequest);
    return result.data;
}

export const createBook = async (bookRequest:BookRequest):Promise<string> =>{
    const result = await api.post(`/books/Create`, bookRequest);
    return result.data;
}