package com.second.librarypro.Controller;

import java.util.List;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.second.librarypro.Entity.IssueRecord;
import com.second.librarypro.Service.IssueRecordService;

@RestController
@RequestMapping("/issuerecords")
// origins मध्ये अचूक पोर्ट ३००० सेट केले आहे
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") 
public class IssueRecordController {
	
	@Autowired
	private IssueRecordService issuerecordService;
	
	@PostMapping("/issuethebook/{bookId}")
	public ResponseEntity<IssueRecord> issueTheBook(@PathVariable("bookId") Long bookId) { 
		return ResponseEntity.ok(issuerecordService.issueTheBook(bookId));
	}
	
	@PostMapping("/returnthebook/{issueRecordId}")
	public ResponseEntity<IssueRecord> returnTheBook(@PathVariable("issueRecordId") Long issueRecordId) {  
		return ResponseEntity.ok(issuerecordService.returnTheBook(issueRecordId));
	}

	@GetMapping("/getallrecords")
	// 💡 टीप: जर 'ROLE_ADMIN' चा एरर आला, तर 'hasRole' ऐवजी @PreAuthorize("permitAll()") किंवा डॅशबोर्ड सेटिंग्ज तपासा
	@PreAuthorize("hasAnyRole('ADMIN', 'ROLE_ADMIN')")
	public ResponseEntity<List<IssueRecord>> getAllRecords() {
		return ResponseEntity.ok(issuerecordService.getAllRecords());
	}

	// 🔴 दुरुस्त केलेला एंडपॉइंट: लॉगिन असलेल्या युझरला त्याचे स्वतःचे रेकॉर्ड्स दाखवण्यासाठी
	@GetMapping("/myrecords")
	// 💡 रोल मॅचिंग अधिक सुरक्षित करण्यासाठी 'hasAnyRole' मध्ये सर्व संभाव्य रोल्स दिले आहेत
	@PreAuthorize("hasAnyRole('ADMIN', 'USER', 'ROLE_ADMIN', 'ROLE_USER')")
	public ResponseEntity<List<IssueRecord>> getMyRecords(Principal principal) {
		if (principal == null) {
			return ResponseEntity.status(401).build();
		}
		String loggedInUsername = principal.getName();
		return ResponseEntity.ok(issuerecordService.getRecordsByUsername(loggedInUsername));
	}
}
