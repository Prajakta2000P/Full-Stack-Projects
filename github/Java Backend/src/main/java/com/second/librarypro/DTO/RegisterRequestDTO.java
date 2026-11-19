package com.second.librarypro.DTO;

//either a user or admin user will register here

import lombok.Builder;
import lombok.Data;


@Data
@Builder         // because when a new user is registered it should be deserialized to DTO
public class RegisterRequestDTO {
	
	
	
	private String username;
	private String email;
	private String password;
	

}
