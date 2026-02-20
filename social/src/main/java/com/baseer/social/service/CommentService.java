package com.baseer.social.service;

import com.baseer.social.dto.CommentRequest;
import com.baseer.social.entity.Comment;
import com.baseer.social.entity.Post;
import com.baseer.social.entity.Reply;
import com.baseer.social.entity.User;
import com.baseer.social.exceptionHandling.CustomException;
import com.baseer.social.repository.CommentRepository;
import com.baseer.social.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for comment operations.
 */
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReplyRepository replyRepository;
    private final PostService postService;
    private final UserService userService;

    /**
     * Add comment to post
     */
    @Transactional
    public Comment addComment(Long postId, CommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = postService.getPostById(postId);

        Comment comment = Comment.builder()
                .post(post)
                .user(currentUser)
                .content(request.getContent())
                .repliesCount(0)
                .build();

        Comment saved = commentRepository.save(comment);
        postService.incrementCommentsCount(postId);

        return saved;
    }

    /**
     * Get comments for a post
     */
    @Transactional(readOnly = true)
    public List<Comment> getPostComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    /**
     * Get comment by ID
     */
    @Transactional(readOnly = true)
    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException("Comment not found", HttpStatus.NOT_FOUND));
    }

    /**
     * Add reply to comment
     */
    @Transactional
    public Reply addReply(Long commentId, CommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Comment comment = getCommentById(commentId);

        Reply reply = Reply.builder()
                .comment(comment)
                .user(currentUser)
                .content(request.getContent())
                .build();

        Reply saved = replyRepository.save(reply);

        comment.setRepliesCount(comment.getRepliesCount() + 1);
        commentRepository.save(comment);

        return saved;
    }

    /**
     * Get replies for a comment
     */
    @Transactional(readOnly = true)
    public List<Reply> getCommentReplies(Long commentId) {
        return replyRepository.findByCommentIdOrderByCreatedAtAsc(commentId);
    }

    /**
     * Delete comment
     */
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = getCommentById(commentId);
        User currentUser = userService.getCurrentUser();

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Unauthorized to delete this comment", HttpStatus.FORBIDDEN);
        }

        commentRepository.delete(comment);
    }

    /**
     * Delete reply
     */
    @Transactional
    public void deleteReply(Long replyId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new CustomException("Reply not found", HttpStatus.NOT_FOUND));

        User currentUser = userService.getCurrentUser();

        if (!reply.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Unauthorized to delete this reply", HttpStatus.FORBIDDEN);
        }

        Comment comment = reply.getComment();
        comment.setRepliesCount(Math.max(0, comment.getRepliesCount() - 1));
        commentRepository.save(comment);

        replyRepository.delete(reply);
    }
}