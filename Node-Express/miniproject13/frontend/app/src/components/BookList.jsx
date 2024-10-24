import React,{useEffect,useState} from 'react'
import axios from 'axios';
import {Table,Button} from 'react-bootstrap';
import {Link} from 'react-router-dom'

function BookList() {
    const [books,setBooks] = useState([])

useEffect(()=>{
    axios.get('http://localhost:5000/books').then(response=>setBooks(response.data)).catch(error=>console.log(error))
},[]);

const handleDelete=(id)=>{
    axios.delete(`http://localhost:5000/books/${id}`)
    .then(()=>setBooks(books.filter(book=>book._id==id))).catch(error=>console.log(error));
}

  return (
<>


<div>
      <Link to="/add" className="btn btn-primary mb-3">Add New Book</Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Description</th>
            <th>Publisher Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books?.map(book => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.description}</td>
              <td>{book.publisherYear}</td>
              <td>
                <Link to={`/edit/${book._id}`} className="btn btn-warning mr-2">Edit</Link>
                <Button variant="danger" onClick={() => handleDelete(book._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>



</>
  )
}

export default BookList