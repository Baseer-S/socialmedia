package com.baseer.social.repository;

import com.baseer.social.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Comment entity.
 * Provides database operations for comment management.
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * Find all comments for a specific post, ordered by creation date
     * @param postId the post ID
     * @return list of comments
     */
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);

    /**
     * Count comments for a specific post
     * @param postId the post ID
     * @return number of comments
     */
    Long countByPostId(Long postId);
}