package com.oanhtp.assignment2.controller;

import com.oanhtp.assignment2.dto.AccountRequest;
import com.oanhtp.assignment2.dto.AccountResponse;
import com.oanhtp.assignment2.dto.ProfileUpdateRequest;
import com.oanhtp.assignment2.service.SystemAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class SystemAccountController {

    private final SystemAccountService accountService;

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer role) {
        return ResponseEntity.ok(accountService.getAllAccounts(keyword, role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable Integer id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody AccountRequest request) {
        return new ResponseEntity<>(accountService.createAccount(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable Integer id,
            @Valid @RequestBody AccountRequest request) {
        return ResponseEntity.ok(accountService.updateAccount(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAccount(@PathVariable Integer id) {
        accountService.deleteAccount(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Account deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<AccountResponse> updateProfile(
            @PathVariable Integer id,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(accountService.updateProfile(id, request));
    }
}

