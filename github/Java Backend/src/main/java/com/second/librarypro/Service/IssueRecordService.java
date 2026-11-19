package com.second.librarypro.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.second.librarypro.Entity.Book;
import com.second.librarypro.Entity.IssueRecord;
import com.second.librarypro.Entity.User;
import com.second.librarypro.Repository.BookRepository;
import com.second.librarypro.Repository.IssueRecordRepository;
import com.second.librarypro.Repository.UserRepository;

@Service
public class IssueRecordService {
	
	@Autowired
	private IssueRecordRepository issueRecordRepository;
	
	@Autowired
	private BookRepository bookRepository;
	
	@Autowired 
	private UserRepository userRepository;
	
	public IssueRecord issueTheBook(Long bookId) {
		Book book = bookRepository.findById(bookId)
				.orElseThrow(()-> new RuntimeException("Book not found"));
		
		if(book.getQuantity()<=0  || !book.getIsAvailable()) {
			throw new RuntimeException("Book is not available");
		}
		
		String username = SecurityContextHolder.getContext().getAuthentication().getName(); 
		User user = userRepository.findByUsername(username)
				.orElseThrow(()-> new RuntimeException("User not found"));
		
		IssueRecord issueRecord = new IssueRecord();
		issueRecord.setIssueDate(LocalDate.now());
		issueRecord.setDueDate(LocalDate.now().plusDays(14)); 
		issueRecord.setIsReturned(false);
		issueRecord.setUser(user);
		issueRecord.setBook(book);
		
		book.setQuantity(book.getQuantity()-1); 
		
		if(book.getQuantity()==0) { 
			book.setIsAvailable(false);
		}
		
		bookRepository.save(book); 
		return issueRecordRepository.save(issueRecord);
	}
	
	public IssueRecord returnTheBook(Long issueRecordId) {
		IssueRecord issueRecord = issueRecordRepository.findById(issueRecordId)
				.orElseThrow(()-> new RuntimeException("Issue record not found ")); 
		
		if(issueRecord.getIsReturned()) {
			throw new RuntimeException(" Book is already returned"); 
		}
		
		Book book = issueRecord.getBook(); 
		book.setQuantity(book.getQuantity()+1); 
		book.setIsAvailable(true); 
		bookRepository.save(book); 
		
		issueRecord.setReturnDate(LocalDate.now()); 
		issueRecord.setIsReturned(true);
		
		return issueRecordRepository.save(issueRecord);
	}

	public List<IssueRecord> getAllRecords() {
		return issueRecordRepository.findAll();
	}

	// 🔴 दुरुस्त केलेली मेथड: कंट्रोलर मधून येणारा युझरनेम वापरून रेकॉर्ड्स फिल्टर करणे
	public List<IssueRecord> getRecordsByUsername(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("User not found: " + username));
		
		return issueRecordRepository.findAll().stream()
				.filter(record -> record.getUser() != null && record.getUser().getId().equals(user.getId()))
				.collect(Collectors.toList());
	}
}
