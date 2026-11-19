package com.second.librarypro.Entity;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 🔴 नवीन इम्पॉर्ट
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "issuerecords")
public class IssueRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private LocalDate issueDate;
	private LocalDate dueDate;
	private LocalDate returnDate;
	private Boolean isReturned; 
	
	@ManyToOne 
	@JoinColumn(name = "user_id") // foreign key
	@JsonIgnoreProperties({"issueRecords", "password", "roles"}) // 🔴 फिक्स: बॅकएंडचा लूप थांबवण्यासाठी
	private User user;
	
	@ManyToOne 
	@JoinColumn(name = "book_id") // foreign key
	@JsonIgnoreProperties("issueRecords") // 🔴 फिक्स: बॅकएंडचा लूप थांबवण्यासाठी
	private Book book;
}
