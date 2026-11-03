package com.oanhtp.assignment2.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Integer accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
    private String roleName;
    private String token;
}

