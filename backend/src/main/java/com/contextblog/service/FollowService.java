package com.contextblog.service;

import com.contextblog.model.Follow;
import com.contextblog.model.User;
import com.contextblog.repository.FollowRepository;
import com.contextblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {
    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public Follow toggleFollow(Long followingId, String followerUsername) {
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));
        
        if (follower.getId().equals(followingId)) {
            throw new RuntimeException("Cannot follow yourself");
        }
        
        Follow existingFollow = followRepository.findByFollowerIdAndFollowingId(
                follower.getId(), followingId).orElse(null);
        
        if (existingFollow != null) {
            followRepository.delete(existingFollow);
            return null;
        } else {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);
            return followRepository.save(follow);
        }
    }
    
    public boolean isFollowing(Long followingId, String followerUsername) {
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return followRepository.existsByFollowerIdAndFollowingId(follower.getId(), followingId);
    }
    
    public long getFollowerCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }
    
    public long getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }
    
    public List<User> getFollowers(Long userId) {
        return followRepository.findByFollowingId(userId).stream()
                .map(Follow::getFollower)
                .collect(Collectors.toList());
    }
    
    public List<User> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId).stream()
                .map(Follow::getFollowing)
                .collect(Collectors.toList());
    }
}

