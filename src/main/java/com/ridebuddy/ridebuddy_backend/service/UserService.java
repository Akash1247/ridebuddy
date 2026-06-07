package com.ridebuddy.ridebuddy_backend.service;

import org.springframework.stereotype.Service;

import com.ridebuddy.ridebuddy_backend.dto.LoginRequest;
import com.ridebuddy.ridebuddy_backend.dto.SignupRequest;
import com.ridebuddy.ridebuddy_backend.entity.User;
import com.ridebuddy.ridebuddy_backend.repository.UserRepository;
import com.ridebuddy.ridebuddy_backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    public String signup(SignupRequest request) {

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(request.password())
                .phoneNumber(request.phoneNumber())
                .build();
            
            userRepository.save(user);
            return "User registered successfully";    
    }

    public String login(LoginRequest request)
    {
        if(userRepository.findByEmail(request.email()).isPresent()){
            User user = userRepository.findByEmail(request.email()).get();
            if(user.getPassword().equals(request.password())){
                // return "Login successful";
                return jwtUtil.generateToken(user.getEmail());
            }    else{
                // return "Invalid password";
                throw new IllegalArgumentException("Invalid password");
            }
        }
        else{
            // return "User not found";
            throw new IllegalArgumentException("User not found");
        }
    }

    
}
