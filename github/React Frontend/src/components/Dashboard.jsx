import React, { useEffect, useState, useCallback } from 'react';
import { bookService, authService, libraryService } from '../services/api';

export default function Dashboard({ onLogout }) {
  const [books, setBooks] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('books');


const [searchedBook, setSearchedBook] = useState(null);




  // Book Form States
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [myRecords, setMyRecords] = useState([]); // 👈 ही ओळ पुन्हा जोडा


  // Admin Registration States
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');





  const loggedInUser = localStorage.getItem('username') || 'User';
  const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('ROLE_ADMIN');





  const loadBooks = useCallback(async () => {
    try {
      setErrorMessage('');
      const data = await bookService.getBooks();
      setBooks(data || []);
    } catch (error) {
      console.error(error);
      setErrorMessage("पुस्तके लोड करताना त्रुटी आली.");
    }
  }, []);

  const loadAllRecords = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await libraryService.getAllRecords();
      setAllRecords(data || []);
    } catch (error) {
      console.error(error);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadBooks();
    if (isAdmin) loadAllRecords();
  }, [isAdmin, loadBooks, loadAllRecords]);

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };



  const loadMyRecords = useCallback(async () => {
    try {
      const data = await libraryService.getMyRecords();
      setMyRecords(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadBooks();
    loadMyRecords(); // 👈 युजरचे रेकॉर्ड्स लोड करण्यासाठी हे फंक्शन पुन्हा सुरू केले
    if (isAdmin) loadAllRecords();
  }, [isAdmin, loadBooks, loadMyRecords, loadAllRecords]);





  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      const bookQty = parseInt(quantity) || 1;
      await bookService.addBook({
        title,
        author,
        isbn: "ISBN-" + Math.floor(Math.random() * 1000),
        quantity: bookQty,
        isAvailable: bookQty > 0
      });
      showNotification("नवीन पुस्तक यशस्वीरित्या जोडले गेले!");
      setTitle('');
      setAuthor('');
      setQuantity('');
      loadBooks();
    } catch (error) {
      showNotification("पुस्तक जतन करताना त्रुटी आली.", false);
    }
  };




  const handleIssueBook = async (bookId) => {
    try {
      await libraryService.issueBook(bookId);
      showNotification("पुस्तक यशस्वीरित्या इश्यू झाले!");
      loadBooks();
      loadMyRecords(); // 👈 युजरची लिस्ट लगेच रिफ्रेश करण्यासाठी
      if (isAdmin) loadAllRecords();
    } catch (error) {
      const errMsg = error.response?.data?.message || "इश्यू करताना त्रुटी आली. स्टॉक तपासा.";
      showNotification(errMsg, false);
    }
  };

  const handleReturnBook = async (recordId) => {
    try {
      await libraryService.returnBook(recordId);
      showNotification("पुस्तक यशस्वीरित्या रिटर्न झाले!");
      loadBooks();
      loadMyRecords(); // 👈 युजरची लिस्ट लगेच रिफ्रेश करण्यासाठी
      if (isAdmin) loadAllRecords();
    } catch (error) {
      const errMsg = error.response?.data?.message || "पुस्तक रिटर्न करताना त्रुटी आली.";
      showNotification(errMsg, false);
    }
  };


  const handleAdminRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.registerAdmin({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword
      });
      showNotification(`नवीन ॲडमिन "${adminUsername}" रजिस्टर झाला!`);
      setAdminUsername('');
      setAdminEmail('');
      setAdminPassword('');
    } catch (error) {
      // बॅकएंड एरर मेसेज दाखवणे (उदा. Username already exists)
      const errMsg = error.response?.data?.message || "रजिस्ट्रेशन करताना त्रुटी आली.";
      showNotification(errMsg, false);
    }
  };



  return (
    
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Dynamic Navbar */}
      <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px 30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '30px', borderRadius: '6px' }}>
        <h2>📚 Library Management System</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>👤 Welcome, {loggedInUser} ({isAdmin ? 'ADMIN 👑' : 'USER 👤'})!</span>
          
          {/* १. मूळ Catalog बटन */}
          <button onClick={() => { setActiveTab('books'); loadBooks(); }} className={`btn ${activeTab === 'books' ? 'btn-success' : ''}`} style={{ border: '1px solid #ccc', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Catalog</button>
          
          {/* ➕ नवीन जोडलेले Search Book बटन (दोन्ही युजर्ससाठी चालू राहील) */}
          <button onClick={() => setActiveTab('search-book')} className={`btn ${activeTab === 'search-book' ? 'btn-success' : ''}`} style={{ border: '1px solid #ccc', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Search Book 🔍</button>
          
          {isAdmin && (
            <>
              <button onClick={() => { setActiveTab('all-history'); loadAllRecords(); }} className={`btn ${activeTab === 'all-history' ? 'btn-success' : ''}`} style={{ border: '1px solid #ccc', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>All Records 📜</button>
              <button onClick={() => setActiveTab('admin-reg')} className={`btn ${activeTab === 'admin-reg' ? 'btn-success' : ''}`} style={{ border: '1px solid #ccc', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Add Admin</button>
            </>
          )}
          <button onClick={() => { authService.logout(); onLogout(); }} className="btn btn-danger" style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>




      {errorMessage && <div className="error-message" style={{ color: '#e74c3c', backgroundColor: '#fde8e7', padding: '10px', borderRadius: '4px', marginBottom: '15px', borderLeft: '4px solid #e74c3c' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: '#27ae60', backgroundColor: '#e8f8f0', padding: '10px', margin: '10px 0', borderRadius: '4px', borderLeft: '4px solid #27ae60', fontWeight: 'bold' }}>{successMessage}</div>}

      {/* टीप: यानंतर तुमचे activeTab चे इतर ब्लॉक्स आणि शेवटी </div> ); येईल */}



{/* Main Content Tabs */}
{activeTab === 'books' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
    
    {/* Quick Action Forms Layout */}
    <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1.5fr 1fr' : '1fr', gap: '20px' }}>
      
      {/* 👑 फक्त ॲडमिनसाठी: Add, Update, आणि Delete चे ऑप्शन्स */}
      {isAdmin && (
        <div className="book-form" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          
          {/* A) Add New Book */}
          <h3>➕ Add New Book</h3>
          <form onSubmit={handleBookSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end', marginTop: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Title</label>
              <input type="text" placeholder="Enter book title" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '180px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Author</label>
              <input type="text" placeholder="Enter author name" value={author} onChange={e => setAuthor(e.target.value)} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '140px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Qty</label>
              <input type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '70px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>Add</button>
          </form>

          {/* B) Update & Delete Inner Container */}
          <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Update Book */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#f39c12' }}>✏️ Update Book via Book ID</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                const id = e.target.updateBookIdInput.value;
                const uTitle = e.target.updateTitleInput.value;
                const uAuthor = e.target.updateAuthorInput.value;
                const uQty = parseInt(e.target.updateQtyInput.value) || 1;
                if(id) {
                  bookService.updateBook(id, { title: uTitle, author: uAuthor, isbn: "ISBN-" + id, quantity: uQty, isAvailable: uQty > 0 })
                    .then(() => {
                      showNotification("पुस्तक यशस्वीरित्या अपडेट झाले!");
                      loadBooks();
                      e.target.reset();
                    })
                    .catch((err) => {
                      const msg = err.response?.data?.message || "अपडेट करताना त्रुटी आली.";
                      showNotification(msg, false);
                    });
                }
              }} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Book ID</label>
                  <input type="number" name="updateBookIdInput" placeholder="ID" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '80px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>New Title</label>
                  <input type="text" name="updateTitleInput" placeholder="New Title" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '180px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>New Author</label>
                  <input type="text" name="updateAuthorInput" placeholder="New Author" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '140px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Qty</label>
                  <input type="number" name="updateQtyInput" placeholder="Qty" required min="1" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '70px' }} />
                </div>
                <button type="submit" className="btn" style={{ padding: '10px 20px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>Update</button>
              </form>
            </div>

            {/* Delete Book */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#e74c3c' }}>🗑️ Delete Book via Book ID</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                const id = e.target.deleteBookIdInput.value;
                if(id && window.confirm("तुम्हाला खात्री आहे? पुस्तक डिलीट होईल.")) {
                  bookService.deleteBook(id)
                    .then(() => {
                      showNotification("पुस्तक यशस्वीरित्या डिलीट केले!");
                      loadBooks();
                      e.target.reset();
                    })
                    .catch((err) => {
                      const msg = err.response?.data?.message || "डिलीट करताना त्रुटी आली.";
                      showNotification(msg, false);
                    });
                }
              }} style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Enter Book ID</label>
                  <input type="number" name="deleteBookIdInput" placeholder="Book ID to Delete" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '160px' }} />
                </div>
                <button type="submit" className="btn" style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>Delete</button>
              </form>
            </div>

          </div>
        </div>
      )}









      {/* 👤 युजर काउंटर ॲक्शन्स - पूर्ण पेजवर फक्त एकदाच दिसेल (Issue & Return) */}
      <div className="book-form" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4 style={{ margin: '0 0 10px 0' }}>📖 Issue a Book</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            const id = e.target.bookIdInput.value;
            if(id){ handleIssueBook(id); e.target.reset(); }
          }} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="number" name="bookIdInput" placeholder="Enter Book ID" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '180px' }} />
            <button type="submit" className="btn btn-success" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>Issue</button>
          </form>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '5px 0' }} />

        <div>
          <h4 style={{ margin: '0 0 10px 0' }}>🔄 Return a Book</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            const id = e.target.recordIdInput.value;
            if(id){ handleReturnBook(id); e.target.reset(); }
          }} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="number" name="recordIdInput" placeholder="Enter Record ID" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '180px' }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>Return</button>
          </form>
        </div>
      </div>

    </div>
  </div>
)}








{/* 📋 हे दोन्ही टेबल्स फक्त आणि फक्त 'books' (Catalog) टॅब ॲक्टिव्ह असतानाच दिसतील */}
    {activeTab === 'books' && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>
        
        {/* A) Available Books List Table */}
        <div className="table-container" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>📖 Available Books (Note down the Book ID to Issue)</h3>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Book ID</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Title</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Author</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Stock</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '12px' }}>{b.id}</td>
                  <td style={{ padding: '12px' }}>{b.title}</td>
                  <td style={{ padding: '12px' }}>{b.author}</td>
                  <td style={{ padding: '12px' }}>{b.quantity}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: b.isAvailable ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
                      {b.isAvailable ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


























      {/* 🔍 NEW PAGE VIEW: Get Book Details by ID (कॅटलॉग टेबलच्या खाली आणि स्वतंत्र पेजसारखा) */}
      {activeTab === 'search-book' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
          <div className="book-form" style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#3498db' }}>🔍 Search Book Details by ID</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const id = e.target.searchBookIdInput.value;
              if (id) {
                // कॅटलॉग यादीमधून (Catalog list) आयडी मॅच करणे
                const foundBook = books.find(b => b.id === parseInt(id));
                if (foundBook) {
                  setSearchedBook(foundBook); // 👈 सापडलेला डेटा स्टेटमध्ये जाईल
                } else {
                  setSearchedBook(null);
                  showNotification("या ID चे कोणतेही पुस्तक कॅटलॉगमध्ये अस्तित्वात नाही.", false);
                }
              }
            }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <input type="number" name="searchBookIdInput" placeholder="Enter Book ID to Search" required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '220px' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>Search Book</button>
            </form>
          </div>

          {/* 📚 पुस्तक सापडल्यानंतर स्वतंत्र कार्डवर पूर्ण माहिती लोड करणे */}
          {searchedBook && (
            <div className="table-container" style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderLeft: '5px solid #3498db' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>📖 Book Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '15px', lineHeight: '1.6' }}>
                <strong>Book ID:</strong> <span>{searchedBook.id}</span>
                <strong>Title / नाव:</strong> <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{searchedBook.title}</span>
                <strong>Author / लेखक:</strong> <span>{searchedBook.author}</span>
                <strong>Total Stock:</strong> <span>{searchedBook.quantity} Copies</span>
                <strong>Status:</strong> 
                <span style={{ color: searchedBook.isAvailable ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
                  {searchedBook.isAvailable ? "● Available (शिल्लक आहे)" : "● Out of Stock (संपले आहे)"}
                </span>
              </div>
              <button onClick={() => setSearchedBook(null)} style={{ marginTop: '20px', padding: '6px 12px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Clear Result</button>
            </div>
          )}
        </div>
      )}








        {/* B) USER View: My Personal Issue Records */}
        <div className="table-container" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>📜 My Issued Books & History</h3>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Record ID</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Book Title</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Issue Date</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Return Date</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myRecords && myRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '12px', textAlign: 'center', color: '#7f8c8d' }}>तुम्ही अद्याप कोणतेही पुस्तक इश्यू केलेले नाही.</td>
                </tr>
              ) : (
                myRecords && myRecords.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px' }}>{r.id}</td>
                    <td style={{ padding: '12px' }}>{r.book?.title || r.bookTitle || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{r.issueDate}</td>
                    <td style={{ padding: '12px' }}>{r.returnDate || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: r.isReturned ? '#2ecc71' : '#e67e22', fontWeight: 'bold', fontSize: '13px' }}>
                        {r.isReturned ? "Returned" : "Borrowed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    )}








                {/* ADMIN View: All History */}
                {isAdmin && activeTab === 'all-history' && (
                  <div className="table-container" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px' }}>📜 All System Issue & Return Records (Admin View)</h3>

                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Record ID</th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>User</th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Book</th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Issue Date</th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Return Date</th>
                          <th style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* लूप आता व्यवस्थित सर्व डेटा सेल्स (td) ला कव्हर करतो */}
                        {allRecords.map(r => (
                          <tr key={r.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                            <td style={{ padding: '12px' }}>{r.id}</td>
                            <td style={{ padding: '12px' }}>{r.user?.username || r.username || 'Unknown'}</td>
                            <td style={{ padding: '12px' }}>{r.book?.title || r.bookTitle || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>{r.issueDate}</td>
                            <td style={{ padding: '12px' }}>{r.returnDate || '-'}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ color: r.isReturned ? '#2ecc71' : '#e67e22', fontWeight: 'bold', fontSize: '13px' }}>
                                {r.isReturned ? "Returned" : "Borrowed"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}




                {/* ADMIN View: Register Admin Form */}
                {isAdmin && activeTab === 'admin-reg' && (
                  <div className="login-container" style={{ margin: '30px auto', padding: '25px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '350px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>👑 Register Admin User</h2>

                    <form onSubmit={handleAdminRegister}>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                        <input type="text" placeholder="Username" value={adminUsername} onChange={e => setAdminUsername(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                      </div>

                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input type="email" placeholder="Email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                      </div>

                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input type="password" placeholder="Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Create Admin Account
                      </button>
                    </form>
                  </div>
                )}






{/* 🔍 NEW PAGE VIEW: Get Book Details by ID (कॅटलॉगच्या स्वतंत्र नवीन पेज व्ह्यू) */}
{activeTab === 'search-book' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
    
    {/* १. सर्च इनपुट फॉर्म */}
    <div className="book-form" style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#3498db' }}>🔍 Search Book Details by ID</h3>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const id = e.target.searchBookIdInput.value;
        if (id) {
          // कॅटलॉग यादीमधून (Catalog list) आयडी मॅच करणे
          const foundBook = books.find(b => b.id === parseInt(id));
          if (foundBook) {
            setSearchedBook(foundBook); // पुस्तक सापडल्यास स्टेटमध्ये डेटा सेव्ह होईल
          } else {
            setSearchedBook(null);
            showNotification("या ID चे कोणतेही पुस्तक कॅटलॉगमध्ये अस्तित्वात नाही.", false);
          }
        }
      }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input 
          type="number" 
          name="searchBookIdInput" 
          placeholder="Enter Book ID to Search" 
          required 
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', width: '220px' }} 
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>
          Search Book
        </button>
      </form>
    </div>

    {/* २. पुस्तक सापडल्यानंतर स्वतंत्र डिस्प्ले कार्ड */}
    {searchedBook && (
      <div className="table-container" style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderLeft: '5px solid #3498db' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>📖 Book Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '15px', lineHeight: '1.6' }}>
          <strong>Book ID:</strong> <span>{searchedBook.id}</span>
          <strong>Title / नाव:</strong> <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{searchedBook.title}</span>
          <strong>Author / लेखक:</strong> <span>{searchedBook.author}</span>
          <strong>Total Stock:</strong> <span>{searchedBook.quantity} Copies</span>
          <strong>Status:</strong> 
          <span style={{ color: searchedBook.isAvailable ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
            {searchedBook.isAvailable ? "● Available (शिल्लक आहे)" : "● Out of Stock (संपले आहे)"}
          </span>
        </div>
        <button onClick={() => setSearchedBook(null)} style={{ marginTop: '20px', padding: '6px 12px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
          Clear Result
        </button>
      </div>
    )}

  </div>
)}

{/* 🛠️ फाईलच्या मुख्य समाप्तीचे क्लोजिंग टॅग्ज जे सिस्टीमला एरर-फ्री लॉक करतात */}
    </div>
  );
}











          
