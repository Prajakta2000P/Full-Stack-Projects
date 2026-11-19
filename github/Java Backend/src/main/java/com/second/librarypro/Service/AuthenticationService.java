package com.second.librarypro.Service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.second.librarypro.DTO.LoginRequestDTO;
import com.second.librarypro.DTO.LoginResponseDTO;
import com.second.librarypro.DTO.RegisterRequestDTO;
import com.second.librarypro.Entity.User;
import com.second.librarypro.JWT.JwtService;
import com.second.librarypro.Repository.UserRepository;

@Service
public class AuthenticationService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	public User registerNormalUser(RegisterRequestDTO registerRequestDTO) {
		if(userRepository.findByUsername(registerRequestDTO.getUsername()).isPresent())  {
			throw new RuntimeException("User already registered");
		}
		
		Set<String> roles = new HashSet<String>();
		roles.add("USER"); 
		
		User user = new User();
		user.setUsername(registerRequestDTO.getUsername());
		user.setEmail(registerRequestDTO.getEmail());
		user.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
		user.setRoles(roles);
		
		return userRepository.save(user);
	}
	
	public User registerAdminUser(RegisterRequestDTO registerRequestDTO) {
		if(userRepository.findByUsername(registerRequestDTO.getUsername()).isPresent()) {
			throw new RuntimeException("User already registered");
		}
		
		Set<String> roles = new HashSet<String>();
		roles.add("ADMIN"); 
		roles.add("USER");  
		
		User user = new User();
		user.setUsername(registerRequestDTO.getUsername());
		user.setEmail(registerRequestDTO.getEmail());
		user.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
		user.setRoles(roles);
		
		return userRepository.save(user);
	}
	
	public LoginResponseDTO login(LoginRequestDTO loginRquestDTO)  {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						loginRquestDTO.getUsername(),
						loginRquestDTO.getPassword())
				 );
		
		User user = userRepository.findByUsername(loginRquestDTO.getUsername())
				.orElseThrow(()-> new RuntimeException("User not found"));
		
		String token = jwtService.generateToken(user);
		
		return LoginResponseDTO.builder()
				.token(token)
				.username(user.getUsername())
				.roles(user.getRoles())
				.build();
	}
}
