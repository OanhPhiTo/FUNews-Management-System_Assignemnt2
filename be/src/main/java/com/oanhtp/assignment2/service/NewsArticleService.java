package com.oanhtp.assignment2.service;

import com.oanhtp.assignment2.dto.NewsArticleRequest;
import com.oanhtp.assignment2.dto.NewsArticleResponse;

import java.util.List;

public interface NewsArticleService {

    List<NewsArticleResponse> getAllArticles(String keyword, Integer categoryId, Boolean status);

    List<NewsArticleResponse> getPublicArticles(String keyword, Integer categoryId);

    List<NewsArticleResponse> getArticlesCreatedBy(Integer staffId);

    NewsArticleResponse getArticleById(String id);

    NewsArticleResponse createArticle(NewsArticleRequest request, Integer currentUserId);

    NewsArticleResponse updateArticle(String id, NewsArticleRequest request, Integer currentUserId);

    void deleteArticle(String id);
}

