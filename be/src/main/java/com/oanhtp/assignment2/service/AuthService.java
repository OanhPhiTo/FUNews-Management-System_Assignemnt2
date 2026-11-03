package com.oanhtp.assignment2.service;

import com.oanhtp.assignment2.dto.LoginRequest;
import com.oanhtp.assignment2.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}

