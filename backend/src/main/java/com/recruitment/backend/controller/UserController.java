package com.recruitment.backend.controller;

import com.recruitment.backend.dto.UserLoginRequest;
import com.recruitment.backend.dto.UserRegistrationRequest;
import com.recruitment.backend.dto.UserResponse;
import com.recruitment.backend.repository.UserRepository;
import com.recruitment.backend.service.UserService;
import com.recruitment.backend.dto.LoginResponse;


import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(
            @Valid @RequestBody UserRegistrationRequest request) {

        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public LoginResponse loginUser(
            @Valid @RequestBody UserLoginRequest request) {

        return userService.loginUser(request);
    }
}