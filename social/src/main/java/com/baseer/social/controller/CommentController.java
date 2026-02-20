package com.baseer.social.controller;

import com.baseer.social.dto.CommentRequest;
import com.baseer.social.entity.Comment;
import com.baseer.social.entity.Reply;
import com.baseer.social.service.CommentService;
import com.baseer.social.websocket.CommentEvent;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for comment endpoints.
 */
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Add comment to post
     * POST /api/comments/post/{postId}
     */
    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request) {
        Comment comment = commentService.addComment(postId, request);

        // Send WebSocket event - use postId from path, not lazy post
        CommentEvent event = CommentEvent.builder()
                .commentId(comment.getId())
                .postId(postId)
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .content(comment.getContent())
                .commentsCount(null)
                .action("COMMENT_ADDED")
                .parentCommentId(null)
                .timestamp(System.currentTimeMillis())
                .build();
        messagingTemplate.convertAndSend("/topic/post/" + postId + "/comments", event);

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    /**
     * Get comments for a post
     * GET /api/comments/post/{postId}
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getPostComments(@PathVariable Long postId) {
        List<Comment> comments = commentService.getPostComments(postId);
        return ResponseEntity.ok(comments);
    }

    /**
     * Add reply to comment
     * POST /api/comments/{commentId}/replies
     */
    @PostMapping("/{commentId}/replies")
    public ResponseEntity<Reply> addReply(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {
        Reply reply = commentService.addReply(commentId, request);

        // Get post id from the comment service
        Long postId = commentService.getCommentById(commentId).getPost() != null
                ? commentService.getCommentById(commentId).getPost().getId()
                : null;

        if (postId != null) {
            CommentEvent event = CommentEvent.builder()
                    .commentId(reply.getId())
                    .postId(postId)
                    .userId(reply.getUser().getId())
                    .username(reply.getUser().getUsername())
                    .content(reply.getContent())
                    .commentsCount(null)
                    .action("REPLY_ADDED")
                    .parentCommentId(commentId)
                    .timestamp(System.currentTimeMillis())
                    .build();
            messagingTemplate.convertAndSend("/topic/post/" + postId + "/comments", event);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(reply);
    }

    /**
     * Get replies for a comment
     * GET /api/comments/{commentId}/replies
     */
    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<Reply>> getCommentReplies(@PathVariable Long commentId) {
        List<Reply> replies = commentService.getCommentReplies(commentId);
        return ResponseEntity.ok(replies);
    }

    /**
     * Delete comment
     * DELETE /api/comments/{commentId}
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete reply
     * DELETE /api/comments/replies/{replyId}
     */
    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long replyId) {
        commentService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }
}