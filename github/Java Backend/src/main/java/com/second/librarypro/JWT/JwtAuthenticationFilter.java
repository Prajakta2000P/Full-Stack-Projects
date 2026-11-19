package com.second.librarypro.JWT;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.second.librarypro.Service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private JwtService jwtService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		final String authHeader = request.getHeader("Authorization");
		final String jwtToken;
		final String username;
		
		// १. ऑथरायझेशन हेडर तपासणे
		if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.length() <= 7) {
			filterChain.doFilter(request, response);
			return;
		}
		
		try {
			jwtToken = authHeader.substring(7).trim();
			username = jwtService.extractUsername(jwtToken);
			
			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				
				UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
						
				if (jwtService.isTokenValid(jwtToken, userDetails)) {
					
					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
							                                            userDetails, 
							                                            null,
							                                            userDetails.getAuthorities()
							                                            );	
					
					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}
		} catch (Exception e) {
			// 🔴 फिक्स: टोकन एक्सपायर किंवा अवैध असल्यास फ्रंटएंडला ४०१ एरर पाठवणे जेणेकरून लोकल स्टोरेज साफ होईल
			logger.error("Cannot set user authentication: " + e.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"JWT Token Expired or Invalid\"}");
			return;
		}
		
		filterChain.doFilter(request, response);
	}
}
