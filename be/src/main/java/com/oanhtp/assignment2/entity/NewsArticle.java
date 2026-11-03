package com.oanhtp.assignment2.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "NewsArticle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {

    @Id
    @Column(name = "NewsArticleID", length = 50, nullable = false)
    private String newsArticleID;

    @Column(name = "NewsTitle", length = 255, nullable = false)
    private String newsTitle;

    @Column(name = "Headline", length = 255, nullable = false)
    private String headline;

    @Column(name = "CreatedDate", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "NewsContent", columnDefinition = "NVARCHAR(MAX)")
    private String newsContent;

    @Column(name = "NewsSource", length = 150)
    private String newsSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;

    @Column(name = "NewsStatus", nullable = false)
    @Builder.Default
    private Boolean newsStatus = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID")
    @JsonIgnoreProperties({"accountPassword", "hibernateLazyInitializer", "handler"})
    private SystemAccount createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UpdatedByID")
    @JsonIgnoreProperties({"accountPassword", "hibernateLazyInitializer", "handler"})
    private SystemAccount updatedBy;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}

