package com.baseer.social.controller;


import com.baseer.social.entity.Like;
import com.baseer.social.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/toggle/{postId}")
    public ResponseEntity<Boolean> toggleLike(@PathVariable Long postId) {
        boolean liked = likeService.toggleLike(postId);
        return ResponseEntity.ok(liked);
    }

    @GetMapping("/check/{postId}")
    public ResponseEntity<Boolean> hasLiked(@PathVariable Long postId) {
        boolean liked = likeService.hasUserLikedPost(postId);
        return ResponseEntity.ok(liked);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getPostLikes(@PathVariable Long postId) {
        List<Like> likes = likeService.getPostLikes(postId);
        return ResponseEntity.ok(likes);
    }
}
