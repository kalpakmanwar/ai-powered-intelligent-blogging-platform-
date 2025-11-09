package com.contextblog.service;

import com.contextblog.model.Blog;
import com.contextblog.model.Comment;
import com.contextblog.model.Like;
import com.contextblog.model.User;
import com.contextblog.model.dto.BlogRequest;
import com.contextblog.model.dto.CommentRequest;
import com.contextblog.repository.BlogRepository;
import com.contextblog.repository.CommentRepository;
import com.contextblog.repository.LikeRepository;
import com.contextblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BlogService {
    @Autowired
    private BlogRepository blogRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private AiService aiService;
    
    public Blog createBlog(BlogRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setAuthor(author);
        
        // Generate AI summary and tags
        blog.setSummary(aiService.generateSummary(request.getContent()));
        blog.setTags(aiService.generateTags(request.getTitle(), request.getContent()));
        blog.setLikeCount(0);
        blog.setCommentCount(0);
        
        return blogRepository.save(blog);
    }
    
    public List<Blog> getAllBlogs() {
        return blogRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
    }
    
    public List<Blog> searchBlogs(String keyword) {
        return blogRepository.searchBlogs(keyword);
    }
    
    public List<Blog> getRecommendedBlogs(Long blogId) {
        Blog blog = getBlogById(blogId);
        List<Long> allBlogIds = blogRepository.findAll().stream()
                .map(Blog::getId)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        
        List<Long> similarIds = aiService.findSimilarBlogs(blogId, blog.getContent(), allBlogIds);
        return blogRepository.findAllById(similarIds);
    }
    
    public List<Blog> getAiRecommendedBlogs(Long blogId) {
        Blog blog = getBlogById(blogId);
        List<Long> allBlogIds = blogRepository.findAll().stream()
                .map(Blog::getId)
                .filter(id -> id != null && !id.equals(blogId))
                .collect(Collectors.toList());
        
        // Use AI service to find related blogs
        List<Long> relatedIds = aiService.findRelatedBlogs(blog.getTitle(), blog.getContent(), allBlogIds);
        return blogRepository.findAllById(relatedIds);
    }
    
    public Map<String, Long> getTrendingTags() {
        List<Blog> allBlogs = blogRepository.findAll();
        Map<String, Long> tagCounts = new HashMap<>();
        
        for (Blog blog : allBlogs) {
            if (blog.getTags() != null) {
                for (String tag : blog.getTags()) {
                    tagCounts.put(tag, tagCounts.getOrDefault(tag, 0L) + 1);
                }
            }
        }
        
        // Sort by count and return top 10
        return tagCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (e1, e2) -> e1,
                    LinkedHashMap::new
                ));
    }
    
    @Transactional
    public Like toggleLike(Long blogId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Blog blog = getBlogById(blogId);
        
        Like existingLike = likeRepository.findByUserIdAndBlogId(user.getId(), blogId).orElse(null);
        
        if (existingLike != null) {
            likeRepository.delete(existingLike);
            blog.setLikeCount(Math.max(0, blog.getLikeCount() - 1));
            blogRepository.save(blog);
            return null;
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setBlog(blog);
            like = likeRepository.save(like);
            blog.setLikeCount(blog.getLikeCount() + 1);
            blogRepository.save(blog);
            return like;
        }
    }
    
    public boolean isLiked(Long blogId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return likeRepository.existsByUserIdAndBlogId(user.getId(), blogId);
    }
    
    public Comment addComment(Long blogId, CommentRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Blog blog = getBlogById(blogId);
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setBlog(blog);
        
        comment = commentRepository.save(comment);
        blog.setCommentCount(blog.getCommentCount() + 1);
        blogRepository.save(blog);
        
        return comment;
    }
    
    public List<Comment> getComments(Long blogId) {
        return commentRepository.findByBlogIdOrderByCreatedAtDesc(blogId);
    }
    
    public List<Blog> getUserBlogs(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return blogRepository.findByAuthorIdOrderByCreatedAtDesc(user.getId());
    }
    
    public List<Blog> getTrendingBlogs() {
        // Get blogs sorted by engagement (likes + comments) in the last 7 days
        List<Blog> allBlogs = blogRepository.findAll();
        return allBlogs.stream()
                .filter(blog -> blog.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(7)))
                .sorted((b1, b2) -> {
                    int engagement1 = (b1.getLikeCount() != null ? b1.getLikeCount() : 0) + 
                                     (b1.getCommentCount() != null ? b1.getCommentCount() : 0);
                    int engagement2 = (b2.getLikeCount() != null ? b2.getLikeCount() : 0) + 
                                     (b2.getCommentCount() != null ? b2.getCommentCount() : 0);
                    return Integer.compare(engagement2, engagement1);
                })
                .limit(10)
                .collect(Collectors.toList());
    }
    
    public com.contextblog.model.dto.AnalyzeResponse analyzeContent(String title, String content) {
        // Generate AI summary and tags
        String summary = aiService.generateSummary(content);
        List<String> tags = aiService.generateTags(title, content);
        
        // Find related blogs based on content
        List<Long> allBlogIds = blogRepository.findAll().stream()
                .map(Blog::getId)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        
        List<Long> relatedIds = aiService.findRelatedBlogs(title, content, allBlogIds);
        List<Blog> relatedBlogs = blogRepository.findAllById(relatedIds);
        
        return new com.contextblog.model.dto.AnalyzeResponse(summary, tags, relatedBlogs);
    }
    
    public String getAISuggestion(String text, String context) {
        return aiService.generateSuggestion(text, context);
    }
}
