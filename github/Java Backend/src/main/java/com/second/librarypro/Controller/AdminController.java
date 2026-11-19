package com.second.librarypro.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.second.librarypro.DTO.RegisterRequestDTO;
import com.second.librarypro.Entity.User;
import com.second.librarypro.Service.AuthenticationService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") 
public class AdminController {

	@Autowired
	private AuthenticationService authenticationService;
	
	// 🔴 पहिला ॲडमिन बनवण्यासाठी हा पाथ सिक्युरिटी चेक न करता ओपन चालेल
	@PostMapping("/registeradminuser")
	public ResponseEntity<User> registerAdminUser(@RequestBody RegisterRequestDTO registerRequestDTO)  {
		return ResponseEntity.ok(authenticationService.registerAdminUser(registerRequestDTO));
	}
	
	// Future Example: जर या क्लासमध्ये इतर कॉन्फिगरेशन मेथड्स असतील तर त्यांच्यावर फक्त ॲडमिन सिक्युरिटी राहील
	// @PostMapping("/someotheradminapi")
	// @PreAuthorize("hasRole('ADMIN')")
	// public ResponseEntity<String> secureApi() { return ResponseEntity.ok("Success"); }
}
