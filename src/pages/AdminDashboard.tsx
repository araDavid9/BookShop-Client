import { useState, useEffect } from "react";
import { getAllBooks, type Book } from "../services/BooksService";
import Navbar from "../components/navbar.component.tsx";
import {useAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {updateBook, deleteBook, createBook, type BookRequest} from "../services/AdminService.ts";
import BookSearch from "../components/bookSearch.component.tsx";

enum Role{
    "User" = 1,
    "Admin" = 2,
}

function AdminDashboard() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();


    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        authorName: "",
        authorAge:0,
        authorCountry:"",
        authorBio: "",
        publisherName: "",
        publisherCountry: "",
    });
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const data = await getAllBooks();
            setBooks(data);
        } catch (err) {
            setError("Failed to load books");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedBook(null);
        setFormData({
            name: "",
            price: "",
            stock: "",
            authorName: "",
            authorAge: 0,
            authorCountry: "",
            authorBio: "",
            publisherName: "",
            publisherCountry: "",
        });
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (book: Book) => {
        setModalMode("edit");
        setSelectedBook(book);
        setFormData({
            name: book.name,
            price: book.price.toString(),
            stock: book.stock.toString(),
            authorName: book.author.name,
            authorAge: book.author.age,
            authorCountry: book.author.country,
            authorBio: book.author.bio || "",
            publisherName: book.publisher.name,
            publisherCountry: book.publisher.country || "",
        });
        setFormError("");
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Book name is required";
        if (!formData.price || Number(formData.price) <= 0) return "Valid price is required";
        if (!formData.stock || Number(formData.stock) < 0) return "Valid stock is required";
        if (!formData.authorName.trim()) return "Author name is required";
        if (!formData.authorCountry.trim()) return "Author Country is required";
        if (!formData.authorBio.trim()) return "Author Bio is required";
        if (formData.authorAge === 0)return "Author Age is required";
        if (!formData.publisherName.trim()) return "Publisher name is required";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        setIsSubmitting(true);
        setFormError("");

        try {
            const bookData : BookRequest = {
                book:{
                    name: formData.name,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                },
                author: {
                    name: formData.authorName,
                    age: Number(formData.authorAge),
                    country: formData.authorCountry,
                    bio: formData.authorBio
                },
                publisher: {
                    name: formData.publisherName,
                    country: formData.publisherCountry
                },
            };

            if (modalMode === "create") {
                await createBook(bookData)
            } else {
                if( selectedBook !== null)
                    await updateBook(bookData,selectedBook.id)
            }

            await loadBooks();
            setShowModal(false);
            alert(`Book ${modalMode === "create" ? "created" : "updated"} successfully!`);
        } catch (err: any) {
            setFormError(err.response?.data?.message || "Failed to save book");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (book: Book) => {
        if (!confirm(`Are you sure you want to delete "${book.name}"?`)) {
            return;
        }

        try {
            await deleteBook(book.id)
            await loadBooks();
            alert("Book deleted successfully!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete book");
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
          );
    }

    if(user?.role !== Role.Admin) {
        return (
            <div className="alert alert-danger alert-dismissible fade show">
                You are not allowed to access this page.
                <button type="button" className="btn-close" onClick={()=> navigate("/")}></button>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Admin Dashboard - Books Management</h2>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        + Add New Book
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                )}

                <div className="row mb-4">
                    <div className="col-md-12">
                        <BookSearch onSearch={setSearchQuery} searchText={"Search for books by name / author / publisher "} />
                    </div>
                </div>

                {/*Book section*/}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Author</th>
                                    <th>Publisher</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted">
                                            No books found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBooks.map((book) => (
                                        <tr key={book.id}>
                                            <td>{book.name}</td>
                                            <td>{book.author.name}</td>
                                            <td>{book.publisher.name}</td>
                                            <td>${book.price.toFixed(2)}</td>
                                            <td>
                                                <span className={book.stock > 0 ? "text-success" : "text-danger"}>
                                                    {book.stock}
                                                </span>
                                            </td>

                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => openEditModal(book)}>Edit </button>

                                                <button className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(book)}> Delete </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="modal show d-block" tabIndex={-1} >
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {modalMode === "create" ? "Add New Book" : "Edit Book"}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}/>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        {formError && (
                                            <div className="alert alert-danger">{formError}</div>
                                        )}

                                        <div className="row">
                                            {/* Book Details */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Book Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">Price *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">Stock *</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            {/* Author Details */}
                                            <div className="col-12">
                                                <h6 className="mt-3 mb-3">Author Information</h6>
                                            </div>

                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="authorName"
                                                    value={formData.authorName}
                                                    onChange={handleInputChange}
                                                    disabled={modalMode === "edit"}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-2 mb-3">
                                                <label className="form-label">Age *</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="authorAge"
                                                    value={formData.authorAge}
                                                    onChange={handleInputChange}
                                                    disabled={modalMode === "edit"}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-2 mb-3">
                                                <label className="form-label"> Country *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="authorCountry"
                                                    value={formData.authorCountry}
                                                    onChange={handleInputChange}
                                                    disabled={modalMode === "edit"}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Bio *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="authorBio"
                                                    value={formData.authorBio}
                                                    disabled={modalMode === "edit"}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            {/* Publisher Details */}
                                            <div className="col-12">
                                                <h6 className="mt-3 mb-3">Publisher Information</h6>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="publisherName"
                                                    value={formData.publisherName}
                                                    onChange={handleInputChange}
                                                    disabled={modalMode === "edit"}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Country *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="publisherCountry"
                                                    value={formData.publisherCountry}
                                                    onChange={handleInputChange}
                                                    disabled={modalMode === "edit"}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                modalMode === "create" ? "Create Book" : "Update Book"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminDashboard;