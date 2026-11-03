package com.oanhtp.assignment2.config;

import com.oanhtp.assignment2.entity.Category;
import com.oanhtp.assignment2.entity.NewsArticle;
import com.oanhtp.assignment2.entity.SystemAccount;
import com.oanhtp.assignment2.entity.Tag;
import com.oanhtp.assignment2.repository.CategoryRepository;
import com.oanhtp.assignment2.repository.NewsArticleRepository;
import com.oanhtp.assignment2.repository.SystemAccountRepository;
import com.oanhtp.assignment2.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SystemAccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final NewsArticleRepository newsArticleRepository;

    @Override
    public void run(String... args) {
        if (accountRepository.count() > 0) {
            log.info("Database already initialized, skipping seed.");
            return;
        }

        log.info("Seeding initial data for FUNewsManagementSystem...");

        // 1. Seed Accounts
        SystemAccount admin = SystemAccount.builder()
                .accountName("System Administrator")
                .accountEmail("admin@fpt.edu.vn")
                .accountRole(1) // Admin
                .accountPassword("admin123")
                .build();
        admin = accountRepository.save(admin);

        SystemAccount staff1 = SystemAccount.builder()
                .accountName("Nguyen Van Staff")
                .accountEmail("staff1@fpt.edu.vn")
                .accountRole(2) // Staff
                .accountPassword("staff123")
                .build();
        staff1 = accountRepository.save(staff1);

        SystemAccount staff2 = SystemAccount.builder()
                .accountName("Tran Thi Staff")
                .accountEmail("staff2@fpt.edu.vn")
                .accountRole(2) // Staff
                .accountPassword("staff123")
                .build();
        staff2 = accountRepository.save(staff2);

        // Account with no articles (can be deleted by Admin for testing)
        SystemAccount dummyStaff = SystemAccount.builder()
                .accountName("Le Van Test (No Articles)")
                .accountEmail("teststaff@fpt.edu.vn")
                .accountRole(2)
                .accountPassword("staff123")
                .build();
        accountRepository.save(dummyStaff);

        // 2. Seed Categories
        Category catAcademic = Category.builder()
                .categoryName("Academic & Education")
                .categoryDesciption("Updates on curriculum, academic seminars, and exams")
                .isActive(true)
                .build();
        catAcademic = categoryRepository.save(catAcademic);

        Category catCampus = Category.builder()
                .categoryName("Campus Life")
                .categoryDesciption("Activities, cultural clubs, sports tournaments")
                .isActive(true)
                .build();
        catCampus = categoryRepository.save(catCampus);

        Category catCareer = Category.builder()
                .categoryName("Career & Internship")
                .categoryDesciption("Job fairs, recruitment notices, internship guidance")
                .parentCategory(catAcademic)
                .isActive(true)
                .build();
        catCareer = categoryRepository.save(catCareer);

        // Category with no articles (can be deleted by Staff for testing)
        Category emptyCat = Category.builder()
                .categoryName("Temporary Category (Empty)")
                .categoryDesciption("This category has no articles and can be safely deleted")
                .isActive(true)
                .build();
        categoryRepository.save(emptyCat);

        // 3. Seed Tags
        Tag tagTech = Tag.builder().tagName("Technology").note("Software, AI, Cloud").build();
        Tag tagEvent = Tag.builder().tagName("University Event").note("Campus workshops & events").build();
        Tag tagCareerGuide = Tag.builder().tagName("Career Guidance").note("Career tips and guides").build();
        Tag tagAlumni = Tag.builder().tagName("Alumni").note("Alumni network").build();

        tagTech = tagRepository.save(tagTech);
        tagEvent = tagRepository.save(tagEvent);
        tagCareerGuide = tagRepository.save(tagCareerGuide);
        tagAlumni = tagRepository.save(tagAlumni);

        // 4. Seed News Articles
        NewsArticle article1 = NewsArticle.builder()
                .newsArticleID("NA1001")
                .newsTitle("Welcome Fall 2026 Orientation for Freshmen")
                .headline("FPT University welcomes thousands of new students to the new academic year")
                .createdDate(LocalDateTime.now().minusDays(3))
                .newsContent("The Fall 2026 semester has officially begun with lively orientation sessions across all campuses. Students participated in club fairs, campus tours, and meeting academic advisors.")
                .newsSource("FU Press Office")
                .category(catCampus)
                .newsStatus(true)
                .createdBy(staff1)
                .tags(Set.of(tagEvent))
                .build();
        newsArticleRepository.save(article1);

        NewsArticle article2 = NewsArticle.builder()
                .newsArticleID("NA1002")
                .newsTitle("Annual Tech Day 2026: Innovations in Generative AI")
                .headline("Keynote speakers from top tech firms showcase cutting-edge breakthroughs")
                .createdDate(LocalDateTime.now().minusDays(1))
                .newsContent("Join us at the Main Auditorium for Tech Day 2026 featuring hands-on workshops on Agentic AI, Spring Boot 3 cloud native microservices, and React modern frontends.")
                .newsSource("IT Faculty")
                .category(catAcademic)
                .newsStatus(true)
                .createdBy(staff1)
                .tags(Set.of(tagTech, tagEvent))
                .build();
        newsArticleRepository.save(article2);

        NewsArticle article3 = NewsArticle.builder()
                .newsArticleID("NA1003")
                .newsTitle("Global Internship Opportunities with FPT Software")
                .headline("Over 200 openings for software engineering and data science interns")
                .createdDate(LocalDateTime.now().minusHours(12))
                .newsContent("FPT Software is offering exciting internship placements for penultimate and final year students. Apply before the deadline to participate in interview rounds.")
                .newsSource("Career Center")
                .category(catCareer)
                .newsStatus(true)
                .createdBy(staff2)
                .tags(Set.of(tagCareerGuide))
                .build();
        newsArticleRepository.save(article3);

        log.info("Initial data seeded successfully!");
    }
}

