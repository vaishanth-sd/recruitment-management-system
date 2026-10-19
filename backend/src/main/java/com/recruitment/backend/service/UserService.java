package com.recruitment.backend.service;

import com.recruitment.backend.dto.UserLoginRequest;
import com.recruitment.backend.dto.UserRegistrationRequest;
import com.recruitment.backend.dto.UserResponse;
import com.recruitment.backend.entity.User;
import com.recruitment.backend.repository.UserRepository;
import com.recruitment.backend.exception.InvalidCredentialsException;
import com.recruitment.backend.dto.LoginResponse;
import com.recruitment.backend.security.JwtService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtService = jwtService;
    }

    public UserResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CANDIDATE");

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole());
    }

    public LoginResponse loginUser(UserLoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token);
    }

}