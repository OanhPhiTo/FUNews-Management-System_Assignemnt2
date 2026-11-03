package com.oanhtp.assignment2.service.impl;

import com.oanhtp.assignment2.dto.AccountRequest;
import com.oanhtp.assignment2.dto.AccountResponse;
import com.oanhtp.assignment2.dto.ProfileUpdateRequest;
import com.oanhtp.assignment2.entity.SystemAccount;
import com.oanhtp.assignment2.exception.BadRequestException;
import com.oanhtp.assignment2.exception.ResourceNotFoundException;
import com.oanhtp.assignment2.repository.NewsArticleRepository;
import com.oanhtp.assignment2.repository.SystemAccountRepository;
import com.oanhtp.assignment2.service.SystemAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemAccountServiceImpl implements SystemAccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    @Override
    public List<AccountResponse> getAllAccounts(String keyword, Integer role) {
        return accountRepository.searchAccounts(keyword, role).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse getAccountById(Integer id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID " + id + " not found."));
        return mapToResponse(account);
    }

    @Override
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        if (accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
            throw new BadRequestException("Email " + request.getAccountEmail() + " already exists in the system.");
        }

        if (request.getAccountPassword() == null || request.getAccountPassword().trim().isEmpty()) {
            throw new BadRequestException("Password is required for new accounts.");
        }

        SystemAccount account = SystemAccount.builder()
                .accountName(request.getAccountName().trim())
                .accountEmail(request.getAccountEmail().trim())
                .accountRole(request.getAccountRole())
                .accountPassword(request.getAccountPassword().trim())
                .build();

        return mapToResponse(accountRepository.save(account));
    }

    @Override
    @Transactional
    public AccountResponse updateAccount(Integer id, AccountRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID " + id + " not found."));

        if (!account.getAccountEmail().equalsIgnoreCase(request.getAccountEmail().trim()) &&
                accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
            throw new BadRequestException("Email " + request.getAccountEmail() + " already exists in the system.");
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(request.getAccountEmail().trim());
        account.setAccountRole(request.getAccountRole());

        if (request.getAccountPassword() != null && !request.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(request.getAccountPassword().trim());
        }

        return mapToResponse(accountRepository.save(account));
    }

    @Override
    @Transactional
    public void deleteAccount(Integer id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID " + id + " not found."));

        // Rule: Admin delete action will delete an account in the case this account is not belong to any news articles (created)
        // If the account is already created any news article, cannot delete.
        if (newsArticleRepository.existsByCreatedBy_AccountID(id)) {
            throw new BadRequestException("Cannot delete account '" + account.getAccountName() + 
                    "' because it has already created one or more news articles in the system.");
        }

        accountRepository.delete(account);
    }

    @Override
    @Transactional
    public AccountResponse updateProfile(Integer id, ProfileUpdateRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID " + id + " not found."));

        if (!account.getAccountEmail().equalsIgnoreCase(request.getAccountEmail().trim()) &&
                accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
            throw new BadRequestException("Email " + request.getAccountEmail() + " already exists in the system.");
        }

        // If user wants to change password
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getOldPassword() == null || !request.getOldPassword().equals(account.getAccountPassword())) {
                throw new BadRequestException("Current password does not match.");
            }
            account.setAccountPassword(request.getNewPassword().trim());
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(request.getAccountEmail().trim());

        return mapToResponse(accountRepository.save(account));
    }

    private AccountResponse mapToResponse(SystemAccount account) {
        boolean hasArticles = newsArticleRepository.existsByCreatedBy_AccountID(account.getAccountID());
        return AccountResponse.builder()
                .accountID(account.getAccountID())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .roleName(account.getAccountRole() == 1 ? "Admin" : "Staff")
                .canDelete(!hasArticles)
                .build();
    }
}

