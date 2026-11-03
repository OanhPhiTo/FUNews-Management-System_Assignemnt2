package com.oanhtp.assignment2.service.impl;

import com.oanhtp.assignment2.dto.NewsArticleRequest;
import com.oanhtp.assignment2.dto.NewsArticleResponse;
import com.oanhtp.assignment2.dto.TagDTO;
import com.oanhtp.assignment2.entity.Category;
import com.oanhtp.assignment2.entity.NewsArticle;
import com.oanhtp.assignment2.entity.SystemAccount;
import com.oanhtp.assignment2.entity.Tag;
import com.oanhtp.assignment2.exception.BadRequestException;
import com.oanhtp.assignment2.exception.ResourceNotFoundException;
import com.oanhtp.assignment2.repository.CategoryRepository;
import com.oanhtp.assignment2.repository.NewsArticleRepository;
import com.oanhtp.assignment2.repository.SystemAccountRepository;
import com.oanhtp.assignment2.repository.TagRepository;
import com.oanhtp.assignment2.service.NewsArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    @Override
    public List<NewsArticleResponse> getAllArticles(String keyword, Integer categoryId, Boolean status) {
        return newsArticleRepository.searchArticles(keyword, categoryId, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsArticleResponse> getPublicArticles(String keyword, Integer categoryId) {
        return newsArticleRepository.searchPublicArticles(keyword, categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsArticleResponse> getArticlesCreatedBy(Integer staffId) {
        return newsArticleRepository.findByCreatedBy_AccountIDOrderByCreatedDateDesc(staffId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NewsArticleResponse getArticleById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article with ID " + id + " not found."));
        return mapToResponse(article);
    }

    @Override
    @Transactional
    public NewsArticleResponse createArticle(NewsArticleRequest request, Integer currentUserId) {
        Category category = categoryRepository.findById(request.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + request.getCategoryID() + " not found."));

        Integer creatorId = request.getCreatedByID() != null ? request.getCreatedByID() : currentUserId;
        if (creatorId == null) {
            throw new BadRequestException("Creator Account ID is required.");
        }

        SystemAccount creator = accountRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator Account with ID " + creatorId + " not found."));

        // Determine ID: user-provided or auto-generated
        String articleId = request.getNewsArticleID();
        if (articleId == null || articleId.trim().isEmpty()) {
            articleId = "NA" + System.currentTimeMillis() % 1000000;
        } else {
            articleId = articleId.trim();
            if (newsArticleRepository.existsById(articleId)) {
                throw new BadRequestException("News article with ID " + articleId + " already exists.");
            }
        }

        Set<Tag> tags = new HashSet<>();
        if (request.getTagIDs() != null && !request.getTagIDs().isEmpty()) {
            tags.addAll(tagRepository.findAllById(request.getTagIDs()));
        }

        NewsArticle article = NewsArticle.builder()
                .newsArticleID(articleId)
                .newsTitle(request.getNewsTitle().trim())
                .headline(request.getHeadline().trim())
                .createdDate(LocalDateTime.now())
                .newsContent(request.getNewsContent().trim())
                .newsSource(request.getNewsSource() != null ? request.getNewsSource().trim() : "Internal")
                .category(category)
                .newsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : true)
                .createdBy(creator)
                .tags(tags)
                .build();

        return mapToResponse(newsArticleRepository.save(article));
    }

    @Override
    @Transactional
    public NewsArticleResponse updateArticle(String id, NewsArticleRequest request, Integer currentUserId) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article with ID " + id + " not found."));

        Category category = categoryRepository.findById(request.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + request.getCategoryID() + " not found."));

        Integer updaterId = request.getUpdatedByID() != null ? request.getUpdatedByID() : currentUserId;
        if (updaterId != null) {
            SystemAccount updater = accountRepository.findById(updaterId)
                    .orElseThrow(() -> new ResourceNotFoundException("Updater Account with ID " + updaterId + " not found."));
            article.setUpdatedBy(updater);
        }

        article.setNewsTitle(request.getNewsTitle().trim());
        article.setHeadline(request.getHeadline().trim());
        article.setNewsContent(request.getNewsContent().trim());
        article.setNewsSource(request.getNewsSource() != null ? request.getNewsSource().trim() : article.getNewsSource());
        article.setCategory(category);
        if (request.getNewsStatus() != null) {
            article.setNewsStatus(request.getNewsStatus());
        }
        article.setModifiedDate(LocalDateTime.now());

        if (request.getTagIDs() != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.getTagIDs()));
            article.setTags(tags);
        }

        return mapToResponse(newsArticleRepository.save(article));
    }

    @Override
    @Transactional
    public void deleteArticle(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article with ID " + id + " not found."));
        // Remove relationships before deleting
        article.getTags().clear();
        newsArticleRepository.delete(article);
    }

    private NewsArticleResponse mapToResponse(NewsArticle article) {
        Set<TagDTO> tagDTOs = article.getTags().stream()
                .map(t -> TagDTO.builder()
                        .tagID(t.getTagID())
                        .tagName(t.getTagName())
                        .note(t.getNote())
                        .build())
                .collect(Collectors.toSet());

        return NewsArticleResponse.builder()
                .newsArticleID(article.getNewsArticleID())
                .newsTitle(article.getNewsTitle())
                .headline(article.getHeadline())
                .createdDate(article.getCreatedDate())
                .newsContent(article.getNewsContent())
                .newsSource(article.getNewsSource())
                .categoryID(article.getCategory().getCategoryID())
                .categoryName(article.getCategory().getCategoryName())
                .newsStatus(article.getNewsStatus())
                .createdByID(article.getCreatedBy() != null ? article.getCreatedBy().getAccountID() : null)
                .createdByName(article.getCreatedBy() != null ? article.getCreatedBy().getAccountName() : null)
                .updatedByID(article.getUpdatedBy() != null ? article.getUpdatedBy().getAccountID() : null)
                .updatedByName(article.getUpdatedBy() != null ? article.getUpdatedBy().getAccountName() : null)
                .modifiedDate(article.getModifiedDate())
                .tags(tagDTOs)
                .build();
    }
}

