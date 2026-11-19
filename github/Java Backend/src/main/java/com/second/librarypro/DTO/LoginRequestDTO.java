package com.second.librarypro.DTO;

import lombok.Builder;
import lombok.Data;


// user will login here admin or user


@Data
@Builder
public class LoginRequestDTO {
	
	
	
	private String username;
	private String password;
	
	

}
