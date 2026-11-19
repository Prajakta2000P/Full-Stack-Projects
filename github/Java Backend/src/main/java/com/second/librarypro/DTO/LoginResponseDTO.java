package com.second.librarypro.DTO;

import java.util.Set;

import lombok.Builder;
import lombok.Data;



// when user will login using username and password he will get a token 


@Data
@Builder

public class LoginResponseDTO {
	
	
	
	
	private String token;
	private String username;
	private Set<String> roles;           
	
	
	

}
