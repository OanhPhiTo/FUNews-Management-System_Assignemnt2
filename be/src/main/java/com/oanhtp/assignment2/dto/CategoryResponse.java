package com.oanhtp.assignment2.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Integer categoryID;
    private String categoryName;
    private String categoryDesciption;
    private Integer parentCategoryID;
    private String parentCategoryName;
    private Boolean isActive;
    private boolean canDelete;
    private long newsCount;
}

