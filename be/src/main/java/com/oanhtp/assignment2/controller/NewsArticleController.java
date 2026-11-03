package com.oanhtp.assignment2.controller;

import com.oanhtp.assignment2.dto.NewsArticleRequest;
import com.oanhtp.assignment2.dto.NewsArticleResponse;
import com.oanhtp.assignment2.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news-articles")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<List<NewsArticleResponse>> getAllArticles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Boolean status) {
        return ResponseEntity.ok(newsArticleService.getAllArticles(keyword, categoryId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleResponse> getArticleById(@PathVariable String id) {
        return ResponseEntity.ok(newsArticleService.getArticleById(id));
    }

    @GetMapping("/history/{staffId}")
    public ResponseEntity<List<NewsArticleResponse>> getNewsHistory(@PathVariable Integer staffId) {
        return ResponseEntity.ok(newsArticleService.getArticlesCreatedBy(staffId));
    }

    @PostMapping
    public ResponseEntity<NewsArticleResponse> createArticle(
            @Valid @RequestBody NewsArticleRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Integer currentUserId) {
        return new ResponseEntity<>(newsArticleService.createArticle(request, currentUserId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleResponse> updateArticle(
            @PathVariable String id,
            @Valid @RequestBody NewsArticleRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Integer currentUserId) {
        return ResponseEntity.ok(newsArticleService.updateArticle(id, request, currentUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteArticle(@PathVariable String id) {
        newsArticleService.deleteArticle(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "News article deleted successfully.");
        return ResponseEntity.ok(response);
    }
}

