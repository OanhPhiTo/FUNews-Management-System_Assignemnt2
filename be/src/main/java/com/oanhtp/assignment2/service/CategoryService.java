package com.oanhtp.assignment2.service;

import com.oanhtp.assignment2.dto.CategoryRequest;
import com.oanhtp.assignment2.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories(String keyword, Boolean isActive);

    List<CategoryResponse> getActiveCategories();

    CategoryResponse getCategoryById(Integer id);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Integer id, CategoryRequest request);

    void deleteCategory(Integer id);
}

