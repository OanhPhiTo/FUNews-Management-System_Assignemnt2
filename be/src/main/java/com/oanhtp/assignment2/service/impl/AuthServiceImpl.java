package com.oanhtp.assignment2.service.impl;

import com.oanhtp.assignment2.dto.LoginRequest;
import com.oanhtp.assignment2.dto.LoginResponse;
import com.oanhtp.assignment2.entity.SystemAccount;
import com.oanhtp.assignment2.exception.BadRequestException;
import com.oanhtp.assignment2.repository.SystemAccountRepository;
import com.oanhtp.assignment2.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final SystemAccountRepository accountRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        SystemAccount account = accountRepository.findByAccountEmail(request.getEmail().trim())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!account.getAccountPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }

        String roleName = account.getAccountRole() == 1 ? "Admin" : "Staff";
        // Simple token for demonstration / session header
        String token = "TOKEN-" + UUID.randomUUID().toString();

        return LoginResponse.builder()
                .accountID(account.getAccountID())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .roleName(roleName)
                .token(token)
                .build();
    }
}

