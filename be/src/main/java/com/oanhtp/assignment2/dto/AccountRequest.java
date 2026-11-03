package com.oanhtp.assignment2.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {

    private Integer accountID;

    @NotBlank(message = "Account name is required")
    @Size(min = 2, max = 100, message = "Account name must be between 2 and 100 characters")
    private String accountName;

    @NotBlank(message = "Account email is required")
    @Email(message = "Email must be valid format (e.g. user@fpt.edu.vn)")
    private String accountEmail;

    @NotNull(message = "Role is required (1: Admin, 2: Staff)")
    private Integer accountRole;

    private String accountPassword;
}

