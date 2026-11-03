package com.oanhtp.assignment2.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Integer categoryID;

    @Column(name = "CategoryName", length = 150, nullable = false)
    private String categoryName;

    @Column(name = "CategoryDesciption", length = 500)
    private String categoryDesciption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCategoryID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "parentCategory"})
    private Category parentCategory;

    @Column(name = "IsActive", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // Helper alias methods for description spelling
    public String getCategoryDescription() {
        return categoryDesciption;
    }

    public void setCategoryDescription(String description) {
        this.categoryDesciption = description;
    }
}

