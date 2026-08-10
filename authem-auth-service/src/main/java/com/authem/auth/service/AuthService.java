package com.authem.auth.service;

import com.authem.auth.dto.request.LoginRequest;
import com.authem.auth.dto.request.RegisterRequest;
import com.authem.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
