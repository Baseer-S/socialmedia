package com.baseer.social.repository;

import com.baseer.social.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Reply entity.
 * Provides database operations for reply management.
 */
@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    /**
     * Find all replies for a specific comment, ordered by creation date
     * @param commentId the comment ID
     * @return list of replies
     */
    List<Reply> findByCommentIdOrderByCreatedAtAsc(Long commentId);

    /**
     * Count replies for a specific comment
     * @param commentId the comment ID
     * @return number of replies
     */
    Long countByCommentId(Long commentId);
}