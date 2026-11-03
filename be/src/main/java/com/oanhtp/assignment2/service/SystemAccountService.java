package com.oanhtp.assignment2.service;

import com.oanhtp.assignment2.dto.AccountRequest;
import com.oanhtp.assignment2.dto.AccountResponse;
import com.oanhtp.assignment2.dto.ProfileUpdateRequest;

import java.util.List;

public interface SystemAccountService {

    List<AccountResponse> getAllAccounts(String keyword, Integer role);

    AccountResponse getAccountById(Integer id);

    AccountResponse createAccount(AccountRequest request);

    AccountResponse updateAccount(Integer id, AccountRequest request);

    void deleteAccount(Integer id);

    AccountResponse updateProfile(Integer id, ProfileUpdateRequest request);
}

