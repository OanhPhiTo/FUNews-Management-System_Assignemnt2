package com.oanhtp.assignment2.service.impl;

import com.oanhtp.assignment2.dto.CategoryRequest;
import com.oanhtp.assignment2.dto.CategoryResponse;
import com.oanhtp.assignment2.entity.Category;
import com.oanhtp.assignment2.exception.BadRequestException;
import com.oanhtp.assignment2.exception.ResourceNotFoundException;
import com.oanhtp.assignment2.repository.CategoryRepository;
import com.oanhtp.assignment2.repository.NewsArticleRepository;
import com.oanhtp.assignment2.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    @Override
    public List<CategoryResponse> getAllCategories(String keyword, Boolean isActive) {
        return categoryRepository.searchCategories(keyword, isActive).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found."));
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category.CategoryBuilder builder = Category.builder()
                .categoryName(request.getCategoryName().trim())
                .categoryDesciption(request.getCategoryDesciption() != null ? request.getCategoryDesciption().trim() : "")
                .isActive(request.getIsActive() != null ? request.getIsActive() : true);

        if (request.getParentCategoryID() != null) {
            Category parent = categoryRepository.findById(request.getParentCategoryID())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Category with ID " + request.getParentCategoryID() + " not found."));
            builder.parentCategory(parent);
        }

        Category saved = categoryRepository.save(builder.build());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Integer id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found."));

        category.setCategoryName(request.getCategoryName().trim());
        category.setCategoryDesciption(request.getCategoryDesciption() != null ? request.getCategoryDesciption().trim() : "");
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }

        if (request.getParentCategoryID() != null) {
            if (request.getParentCategoryID().equals(id)) {
                throw new BadRequestException("Category cannot be its own parent.");
            }
            Category parent = categoryRepository.findById(request.getParentCategoryID())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Category with ID " + request.getParentCategoryID() + " not found."));
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found."));

        // Rule: Staff category management: The delete action will delete an item in the case this item is not belong to any news articles.
        // If the item is already stored in a news article cannot delete.
        if (newsArticleRepository.existsByCategory_CategoryID(id)) {
            throw new BadRequestException("Cannot delete category '" + category.getCategoryName() + 
                    "' because it is currently used by one or more news articles.");
        }

        if (categoryRepository.existsByParentCategory_CategoryID(id)) {
            throw new BadRequestException("Cannot delete category '" + category.getCategoryName() + 
                    "' because other categories depend on it as a parent.");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        boolean hasArticles = newsArticleRepository.existsByCategory_CategoryID(category.getCategoryID());
        boolean hasChildren = categoryRepository.existsByParentCategory_CategoryID(category.getCategoryID());

        return CategoryResponse.builder()
                .categoryID(category.getCategoryID())
                .categoryName(category.getCategoryName())
                .categoryDesciption(category.getCategoryDesciption())
                .parentCategoryID(category.getParentCategory() != null ? category.getParentCategory().getCategoryID() : null)
                .parentCategoryName(category.getParentCategory() != null ? category.getParentCategory().getCategoryName() : null)
                .isActive(category.getIsActive())
                .canDelete(!hasArticles && !hasChildren)
                .build();
    }
}

