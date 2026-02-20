package com.baseer.social.repository;

import com.baseer.social.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Post entity.
 * Provides database operations for post management.
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * Find all posts ordered by creation date (newest first) with pagination
     * @param pageable pagination information
     * @return page of posts
     */

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Find posts by user ID ordered by creation date
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of posts
     */
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Find all posts by user ID
     * @param userId the user ID
     * @return list of posts
     */
    List<Post> findByUserId(Long userId);
}