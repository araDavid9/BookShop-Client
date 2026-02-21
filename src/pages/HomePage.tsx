import NavBar from "../components/navbar.component.tsx";
import { useState,useEffect} from "react";
import {type Book,getAllBooks} from "../services/BooksService.ts";
import BookCard from "../components/bookCard.component.tsx";
import BookSearch from "../components/bookSearch.component.tsx";
import {useAuth} from "../context/AuthContext.tsx";
import {getBookByName} from "../services/BooksService.ts";


function HomePage(){
    const [booksList, setBooksList] = useState<Book[]>([]);
    const [searchedBooks, setSearchBook] = useState<Book | null>();
    const [noBookError, setNoBookError] = useState("");
    const { user } = useAuth();

    useEffect(() => {
       getAllBooks()
           .then(res =>{
               setBooksList(res);
           })
    }, []);

    const handleSearch = async (bookName:string) => {
        setNoBookError("")
        try{
            const result = await getBookByName(bookName);
            if(result === null){
                setNoBookError("No book found");
                return
            }
            setSearchBook(result);
        }
        catch (error){
           if(error.response?.status === 404){
               setNoBookError("No book found");
               return
           }
        }
    }

    const handleClearSearch = () => {
        setSearchBook(null);
        setNoBookError("");
    };

    return (
        <>
            <NavBar/>

            <div className="container d-flex justify-content-center align-items-center">
                <h1>Books List</h1>
            </div>

            <div className="container  justify-content-center align-items-center">
                <BookSearch onSearch={handleSearch} searchText={"Search for books by name..."}/>
                {noBookError && (
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>Not Found:</strong> {noBookError}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setNoBookError("")}
                            aria-label="Close"
                        ></button>
                    </div>
                )}
            </div>


            <div className="container d-flex justify-content-center align-items-center">
                <div className="row">
                    {!searchedBooks ?
                        booksList.map((book: Book,index) =>
                            <div key={index} className="col">
                                <BookCard key={`${book.id}-${index}`} book={book} isLoggedIn={user !== null}/>
                            </div>
                        ) :
                        <BookCard book={searchedBooks} isLoggedIn={user !== null} />
                 }
                </div>
            </div>

            {searchedBooks && (
                <div className="mb-3 text-center">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleClearSearch}
                    >
                        ← Back to all books
                    </button>
                </div>
            )}
        </>
    )
}

export default HomePage;