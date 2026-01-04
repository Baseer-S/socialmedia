package com.baseer.social.repository;

import com.baseer.social.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Like entity.
 * Provides database operations for like management.
 */
@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    /**
     * Find a like by post ID and user ID
     * @param postId the post ID
     * @param userId the user ID
     * @return Optional containing like if found
     */
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);

    /**
     * Check if user has liked a post
     * @param postId the post ID
     * @param userId the user ID
     * @return true if liked, false otherwise
     */
    Boolean existsByPostIdAndUserId(Long postId, Long userId);

    /**
     * Count likes for a specific post
     * @param postId the post ID
     * @return number of likes
     */
    Long countByPostId(Long postId);

    /**
     * Delete like by post and user
     * @param postId the post ID
     * @param userId the user ID
     */
    void deleteByPostIdAndUserId(Long postId, Long userId);
}