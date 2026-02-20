package com.baseer.social.service;

import com.baseer.social.entity.Like;
import com.baseer.social.entity.Post;
import com.baseer.social.entity.User;
import com.baseer.social.repository.LikeRepository;
import com.baseer.social.websocket.LikeEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for like operations.
 */
@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostService postService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Toggle like on a post
     */
    @Transactional
    public boolean toggleLike(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postService.getPostById(postId);

        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, currentUser.getId());

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            postService.decrementLikesCount(postId);
            int newCount = Math.max(0, post.getLikesCount() - 1);
            sendLikeEvent(postId, currentUser, newCount, "UNLIKE");
            return false;
        } else {
            Like like = Like.builder()
                    .post(post)
                    .user(currentUser)
                    .build();
            likeRepository.save(like);
            postService.incrementLikesCount(postId);
            int newCount = post.getLikesCount() + 1;
            sendLikeEvent(postId, currentUser, newCount, "LIKE");
            return true;
        }
    }

    /**
     * Check if current user has liked a post
     */
    public boolean hasUserLikedPost(Long postId) {
        User currentUser = userService.getCurrentUser();
        return likeRepository.existsByPostIdAndUserId(postId, currentUser.getId());
    }

    /**
     * Get like count for a post
     */
    public Long getLikeCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    /**
     * Send like event via WebSocket
     */
    private void sendLikeEvent(Long postId, User user, Integer likesCount, String action) {
        LikeEvent event = LikeEvent.builder()
                .postId(postId)
                .userId(user.getId())
                .username(user.getUsername())
                .likesCount(likesCount)
                .action(action)
                .timestamp(System.currentTimeMillis())
                .build();

        messagingTemplate.convertAndSend("/topic/post/" + postId + "/likes", event);
    }
}