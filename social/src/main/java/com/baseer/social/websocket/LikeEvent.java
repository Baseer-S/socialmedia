package com.baseer.social.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WebSocket event for like notifications.
 * Sent to all clients subscribed to a post when someone likes/unlikes it.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikeEvent {

    private Long postId;
    private Long userId;
    private String username;
    private Integer likesCount;
    private String action; // "LIKE" or "UNLIKE"
    private Long timestamp;
}