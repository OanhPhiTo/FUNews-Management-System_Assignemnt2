package com.oanhtp.assignment2.controller;

import com.oanhtp.assignment2.dto.CategoryResponse;
import com.oanhtp.assignment2.dto.NewsArticleResponse;
import com.oanhtp.assignment2.service.CategoryService;
import com.oanhtp.assignment2.service.NewsArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicNewsController {

    private final NewsArticleService newsArticleService;
    private final CategoryService categoryService;

    @GetMapping("/news")
    public ResponseEntity<List<NewsArticleResponse>> getPublicArticles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(newsArticleService.getPublicArticles(keyword, categoryId));
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<NewsArticleResponse> getPublicArticleById(@PathVariable String id) {
        NewsArticleResponse article = newsArticleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getActiveCategories() {
        return ResponseEntity.ok(categoryService.getActiveCategories());
    }
}

