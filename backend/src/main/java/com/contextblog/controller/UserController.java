package com.contextblog.controller;

import com.contextblog.model.Bookmark;
import com.contextblog.service.BookmarkService;
import com.contextblog.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private FollowService followService;
    
    @Autowired
    private BookmarkService bookmarkService;
    
    @PostMapping("/{userId}/follow")
    public ResponseEntity<Map<String, Object>> toggleFollow(@PathVariable Long userId, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        try {
            com.contextblog.model.Follow follow = followService.toggleFollow(userId, username);
            Map<String, Object> response = new HashMap<>();
            response.put("following", follow != null);
            response.put("followerCount", followService.getFollowerCount(userId));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/{userId}/following")
    public ResponseEntity<Map<String, Boolean>> isFollowing(@PathVariable Long userId, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        boolean following = followService.isFollowing(userId, username);
        return ResponseEntity.ok(Map.of("following", following));
    }
    
    @GetMapping("/{userId}/followers")
    public ResponseEntity<Map<String, Object>> getFollowerStats(@PathVariable Long userId) {
        long followerCount = followService.getFollowerCount(userId);
        long followingCount = followService.getFollowingCount(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("followerCount", followerCount);
        response.put("followingCount", followingCount);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/blogs/{blogId}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@PathVariable Long blogId, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Bookmark bookmark = bookmarkService.toggleBookmark(blogId, username);
        Map<String, Object> response = new HashMap<>();
        response.put("bookmarked", bookmark != null);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/blogs/{blogId}/bookmarked")
    public ResponseEntity<Map<String, Boolean>> isBookmarked(@PathVariable Long blogId, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        boolean bookmarked = bookmarkService.isBookmarked(blogId, username);
        return ResponseEntity.ok(Map.of("bookmarked", bookmarked));
    }
    
    @GetMapping("/bookmarks")
    public ResponseEntity<List<Bookmark>> getMyBookmarks(Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(username));
    }
}

