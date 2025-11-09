package com.contextblog.repository;

import com.contextblog.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword% OR EXISTS (SELECT t FROM b.tags t WHERE t LIKE %:keyword%)")
    List<Blog> searchBlogs(@Param("keyword") String keyword);
    
    List<Blog> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT b FROM Blog b WHERE b.id IN (SELECT l.blog.id FROM Like l GROUP BY l.blog.id ORDER BY COUNT(l) DESC)")
    List<Blog> findMostLikedBlogs();
}

