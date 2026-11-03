package com.oanhtp.assignment2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {

    private Integer categoryID;

    @NotBlank(message = "Category name is required")
    @Size(max = 150, message = "Category name cannot exceed 150 characters")
    private String categoryName;

    private String categoryDesciption;

    private Integer parentCategoryID;

    @Builder.Default
    private Boolean isActive = true;
}

