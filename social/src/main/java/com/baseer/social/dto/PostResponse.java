package com.baseer.social.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private Integer likesCount;
    private Integer commentsCount;
    private LocalDateTime createdAt;
    private UserDTO user;

    @Data
    @Builder
    public static class UserDTO {
        private Long id;
        private String username;
        private String fullName;
        private String profilePicture;
    }
}

