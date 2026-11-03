package com.oanhtp.assignment2.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleResponse {
    private String newsArticleID;
    private String newsTitle;
    private String headline;
    private LocalDateTime createdDate;
    private String newsContent;
    private String newsSource;
    private Integer categoryID;
    private String categoryName;
    private Boolean newsStatus;
    private Integer createdByID;
    private String createdByName;
    private Integer updatedByID;
    private String updatedByName;
    private LocalDateTime modifiedDate;
    private Set<TagDTO> tags;
}

