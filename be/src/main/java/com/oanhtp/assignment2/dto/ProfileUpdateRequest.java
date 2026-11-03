package com.oanhtp.assignment2.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    @NotBlank(message = "Account name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String accountName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid format")
    private String accountEmail;

    private String oldPassword;

    private String newPassword;
}

