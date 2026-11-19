package com.second.librarypro.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.second.librarypro.Repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// 🔴 फिक्स: युझर न सापडल्यास योग्य स्प्रिंग सिक्युरिटी एक्सेप्शन देणे
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
	}
}
