package com.second.librarypro.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.second.librarypro.DTO.BookDTO;
import com.second.librarypro.Entity.Book;
import com.second.librarypro.Service.BookService;



@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") 
public class BookController {
	
	
	
	@Autowired
	private BookService bookService;            // inject bin of service
	

	
	@GetMapping("/getallbooks")
	public ResponseEntity<List<Book>> getAllBooks()
	{
		
		return ResponseEntity.ok(bookService.getAllBooks());
		
	}
	
	
	
	@GetMapping("/getbookbyid/{id}")
	public ResponseEntity<Book> getBookById(@PathVariable Long id)
	{
		
		return ResponseEntity.ok(bookService.getBookById(id));
		
		
	}
	
	
	
	@PostMapping("/addbook")
	                             
	@PreAuthorize("hasRole('ADMIN')")                                               // this api is only accessible to the admin
	public ResponseEntity<Book> addBook(@RequestBody BookDTO bookDTO)
	{
		return ResponseEntity.ok(bookService.addBook(bookDTO));
		
	}
	
	
	
	@PutMapping("/updatebook/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Book> updateBook(@PathVariable Long id,@RequestBody BookDTO bookDTO){
		
		return ResponseEntity.ok(bookService.updateBook(id,bookDTO));
		
	}
	
	
	
	@DeleteMapping("/deletebook/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	
	public ResponseEntity<Void> deleteBook(@PathVariable Long id){
		
		bookService.deleteBookById(id);
		return ResponseEntity.ok().build();
	}
	
	
	
	
	
}
