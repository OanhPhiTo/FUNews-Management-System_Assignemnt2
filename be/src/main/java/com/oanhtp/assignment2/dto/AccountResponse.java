package com.oanhtp.assignment2.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {
    private Integer accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
    private String roleName;
    private boolean canDelete;
}

