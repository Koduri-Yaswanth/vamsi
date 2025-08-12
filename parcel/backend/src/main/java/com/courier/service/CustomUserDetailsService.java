package com.courier.service;

import com.courier.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AuthService authService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("=== CustomUserDetailsService.loadUserByUsername ===");
        System.out.println("Loading user details for email: " + email);
        
        try {
            Customer customer = authService.getCustomerByEmail(email);
            
            if (customer == null) {
                System.out.println("Customer not found for email: " + email);
                throw new UsernameNotFoundException("Customer not found with email: " + email);
            }
            
            System.out.println("Found customer: " + customer.getCustomerName());
            System.out.println("Customer role: " + customer.getRole());
            
            return new User(
                customer.getEmail(),
                customer.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + customer.getRole()))
            );
        } catch (Exception e) {
            System.out.println("Error loading user details: " + e.getMessage());
            e.printStackTrace();
            throw new UsernameNotFoundException("Error loading user details", e);
        }
    }
} 