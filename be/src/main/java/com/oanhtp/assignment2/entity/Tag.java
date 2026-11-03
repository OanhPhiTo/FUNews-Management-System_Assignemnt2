package com.oanhtp.assignment2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TagID")
    private Integer tagID;

    @Column(name = "TagName", length = 100, nullable = false)
    private String tagName;

    @Column(name = "Note", length = 255)
    private String note;
}

