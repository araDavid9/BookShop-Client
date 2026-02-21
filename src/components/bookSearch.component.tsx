import { useState, type FormEvent } from 'react';

interface Props {
    onSearch:(query:string) => void;
    searchText:string;
}

function BookSearch({ onSearch,searchText}: Props) {
    const [bookName, setBookName] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!bookName.trim()) {
            setError(true);
            return;
        }

        setError(false);
        onSearch(bookName);
    }

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className={`form-control form-control-lg ${error ? 'is-invalid' : ''}`}
                                placeholder={searchText}
                                value={bookName}
                                onChange={(e) => {
                                    setBookName(e.target.value);
                                    if (error) {
                                        setError(false);
                                    }
                                }}
                                aria-label="Search books"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg px-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    style={{ marginRight: '8px' }}
                                >
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                                Search
                            </button>
                        </div>
                        {error && (
                            <div className="text-danger small">
                                Please fill the form to search.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BookSearch;