package com.contextblog.service;

import com.contextblog.model.Bookmark;
import com.contextblog.model.Blog;
import com.contextblog.model.User;
import com.contextblog.repository.BookmarkRepository;
import com.contextblog.repository.BlogRepository;
import com.contextblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookmarkService {
    @Autowired
    private BookmarkRepository bookmarkRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BlogRepository blogRepository;
    
    @Transactional
    public Bookmark toggleBookmark(Long blogId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        Bookmark existingBookmark = bookmarkRepository.findByUserIdAndBlogId(
                user.getId(), blogId).orElse(null);
        
        if (existingBookmark != null) {
            bookmarkRepository.delete(existingBookmark);
            return null;
        } else {
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setBlog(blog);
            return bookmarkRepository.save(bookmark);
        }
    }
    
    public boolean isBookmarked(Long blogId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return bookmarkRepository.existsByUserIdAndBlogId(user.getId(), blogId);
    }
    
    public List<Bookmark> getUserBookmarks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}

