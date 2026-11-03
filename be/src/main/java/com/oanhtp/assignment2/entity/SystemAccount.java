package com.oanhtp.assignment2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SystemAccount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID")
    private Integer accountID;

    @Column(name = "AccountName", length = 100, nullable = false)
    private String accountName;

    @Column(name = "AccountEmail", length = 100, nullable = false, unique = true)
    private String accountEmail;

    @Column(name = "AccountRole", nullable = false)
    private Integer accountRole; // 1 = Admin, 2 = Staff

    @Column(name = "AccountPassword", length = 255, nullable = false)
    private String accountPassword;
}

