package com.baseer.social.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating and updating posts.
 * Contains post content and optional image URL.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {

    @NotBlank(message = "Post content is required")
    private String content;

    private String imageUrl;
}