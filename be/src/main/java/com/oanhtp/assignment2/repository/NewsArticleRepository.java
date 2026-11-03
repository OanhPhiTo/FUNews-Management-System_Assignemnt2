package com.oanhtp.assignment2.repository;

import com.oanhtp.assignment2.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    boolean existsByCreatedBy_AccountID(Integer accountId);

    boolean existsByCategory_CategoryID(Integer categoryId);

    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    List<NewsArticle> findByCreatedBy_AccountIDOrderByCreatedDateDesc(Integer accountId);

    @Query("SELECT n FROM NewsArticle n WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.newsSource) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR n.category.categoryID = :categoryId) AND " +
           "(:status IS NULL OR n.newsStatus = :status) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchArticles(@Param("keyword") String keyword,
                                    @Param("categoryId") Integer categoryId,
                                    @Param("status") Boolean status);

    @Query("SELECT n FROM NewsArticle n WHERE " +
           "n.newsStatus = true AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.newsSource) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR n.category.categoryID = :categoryId) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchPublicArticles(@Param("keyword") String keyword,
                                          @Param("categoryId") Integer categoryId);
}
