package com.contextblog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * AI Service that uses OpenRouter API for generating summaries, tags, and recommendations
 */
@Service
public class AiService {
    
    @Autowired
    private OpenRouterService openRouterService;
    
    public String generateSummary(String content) {
        return openRouterService.generateSummary(content);
    }
    
    public List<String> generateTags(String title, String content) {
        return openRouterService.generateTags(title, content);
    }
    
    public List<Long> findSimilarBlogs(Long blogId, String content, List<Long> allBlogIds) {
        // Simple similarity based on content keywords
        // In a production system, you might use embeddings or more sophisticated NLP
        return allBlogIds.stream()
                .filter(id -> !id.equals(blogId))
                .limit(5)
                .collect(Collectors.toList());
    }
    
    public List<Long> findRelatedBlogs(String title, String content, List<Long> allBlogIds) {
        // Extract keywords from title and content for future semantic matching
        // For now, return recent blogs (in production, use semantic similarity with embeddings)
        // This is a placeholder - in production, use vector search or embeddings API
        return allBlogIds.stream()
                .limit(5)
                .collect(Collectors.toList());
    }
    
    public String generateSuggestion(String text, String context) {
        return openRouterService.generateSuggestion(text, context);
    }
}
