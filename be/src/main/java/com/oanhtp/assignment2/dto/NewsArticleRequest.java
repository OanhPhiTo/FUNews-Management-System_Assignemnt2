package com.oanhtp.assignment2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleRequest {

    private String newsArticleID;

    @NotBlank(message = "News title is required")
    private String newsTitle;

    @NotBlank(message = "Headline is required")
    private String headline;

    @NotBlank(message = "News content is required")
    private String newsContent;

    private String newsSource;

    @NotNull(message = "Category is required")
    private Integer categoryID;

    @Builder.Default
    private Boolean newsStatus = true;

    private Integer createdByID;

    private Integer updatedByID;

    private Set<Integer> tagIDs;
}

