package com.contextblog.controller;

import com.contextblog.model.Blog;
import com.contextblog.model.Comment;
import com.contextblog.model.Like;
import com.contextblog.model.dto.AnalyzeRequest;
import com.contextblog.model.dto.AnalyzeResponse;
import com.contextblog.model.dto.BlogRequest;
import com.contextblog.model.dto.CommentRequest;
import com.contextblog.service.BlogService;
import com.contextblog.service.OpenRouterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    @Autowired
    private BlogService blogService;
    
    @Autowired
    private OpenRouterService openRouterService;
    
    @PostMapping
    public ResponseEntity<Blog> createBlog(@Valid @RequestBody BlogRequest request, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Blog blog = blogService.createBlog(request, username);
        return ResponseEntity.ok(blog);
    }
    
    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        try {
            Blog blog = blogService.getBlogById(id);
            return ResponseEntity.ok(blog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Blog>> searchBlogs(@RequestParam String keyword) {
        return ResponseEntity.ok(blogService.searchBlogs(keyword));
    }
    
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<Blog>> getRecommendedBlogs(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getRecommendedBlogs(id));
    }
    
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Like like = blogService.toggleLike(id, username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("liked", like != null);
        response.put("likeCount", blogService.getBlogById(id).getLikeCount());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/liked")
    public ResponseEntity<Map<String, Boolean>> isLiked(@PathVariable Long id, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        boolean liked = blogService.isLiked(id, username);
        return ResponseEntity.ok(Map.of("liked", liked));
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long id, 
                                             @Valid @RequestBody CommentRequest request,
                                             Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Comment comment = blogService.addComment(id, request, username);
        return ResponseEntity.ok(comment);
    }
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getComments(id));
    }
    
    @GetMapping("/user/my-blogs")
    public ResponseEntity<List<Blog>> getMyBlogs(Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(blogService.getUserBlogs(username));
    }
    
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeContent(@Valid @RequestBody AnalyzeRequest request) {
        try {
            AnalyzeResponse response = blogService.analyzeContent(request.getTitle(), request.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to analyze content: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/trending-tags")
    public ResponseEntity<Map<String, Long>> getTrendingTags() {
        return ResponseEntity.ok(blogService.getTrendingTags());
    }
    
    @GetMapping("/{id}/ai-recommendations")
    public ResponseEntity<List<Blog>> getAiRecommendedBlogs(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getAiRecommendedBlogs(id));
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<Blog>> getTrendingBlogs() {
        return ResponseEntity.ok(blogService.getTrendingBlogs());
    }
    
    @PostMapping("/suggest")
    public ResponseEntity<?> getAISuggestions(@Valid @RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            String context = request.getOrDefault("context", "");
            String suggestion = blogService.getAISuggestion(text, context);
            Map<String, String> response = new HashMap<>();
            response.put("suggestion", suggestion);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate suggestion: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/news")
    public ResponseEntity<?> getNews(@RequestParam(defaultValue = "4") int count) {
        try {
            List<Map<String, String>> news = openRouterService.generateNews(count);
            return ResponseEntity.ok(news);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch news: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}

