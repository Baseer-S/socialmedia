package com.baseer.social.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WebSocket event for comment notifications.
 * Sent to all clients subscribed to a post when someone comments/replies.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentEvent {

    private Long commentId;
    private Long postId;
    private Long userId;
    private String username;
    private String content;
    private Integer commentsCount;
    private String action; // "COMMENT_ADDED" or "REPLY_ADDED"
    private Long parentCommentId; // null for top-level comments
    private Long timestamp;
}