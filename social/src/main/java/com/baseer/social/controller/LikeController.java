package com.baseer.social.controller;

import com.baseer.social.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for like endpoints.
 * Handles liking/unliking posts.
 */
@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LikeController {

    private final LikeService likeService;

    /**
     * Toggle like on a post
     * POST /api/likes/post/{postId}
     */
    @PostMapping("/post/{postId}")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long postId) {
        boolean liked = likeService.toggleLike(postId);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", liked);
        response.put("message", liked ? "Post liked" : "Post unliked");

        return ResponseEntity.ok(response);
    }

    /**
     * Check if current user has liked a post
     * GET /api/likes/post/{postId}/status
     */
    @GetMapping("/post/{postId}/status")
    public ResponseEntity<Map<String, Boolean>> getLikeStatus(@PathVariable Long postId) {
        boolean liked = likeService.hasUserLikedPost(postId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("liked", liked);

        return ResponseEntity.ok(response);
    }

    /**
     * Get like count for a post
     * GET /api/likes/post/{postId}/count
     */
    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Map<String, Long>> getLikeCount(@PathVariable Long postId) {
        Long count = likeService.getLikeCount(postId);

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }
}