package com.second.librarypro.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.second.librarypro.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	
	
	Optional<User> findByUsername(String username);         // 
	

}
