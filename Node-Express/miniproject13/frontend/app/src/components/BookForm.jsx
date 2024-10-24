import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

function BookForm() {
    const {id}=useParams();
    const navigate=useNavigate();
    const [book,setBook]=useState({
        title:"",
        author:"",
        description:"",
        publisheryear:''
    })

    useEffect(()=>{
        if(id){
            axios.get(`http://localhost:5000/books/${id}`).then(
                resposne=>setBook(resposne.data)
            ).catch(error=>console.log(error))
        }
    },[id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook(prevBook => ({
          ...prevBook,
          [name]: value
        }));
      };


      const handleSubmit=(e)=>{
        e.preventDefault()
        if(id){
            axios.put(`http://localhost:5000/books/${id}`,book).then(()=>navigate('/')).catch(error=>console.log(error))
        }
        else{
            axios.post(`http://localhost:5000/books`,book).then(()=>navigate('/')).catch(error=>console.log(error))
        }
      }






  return (
<>

<Form onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="author">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="author"
          value={book.author}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={book.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="publisherYear">
        <Form.Label>Publisher Year</Form.Label>
        <Form.Control
          type="number"
          name="publisherYear"
          value={book.publisherYear}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        {id ? 'Update' : 'Add'} Book
      </Button>
    </Form>





</>
  )
}

export default BookForm