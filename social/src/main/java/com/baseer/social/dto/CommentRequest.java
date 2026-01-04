package com.baseer.social.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating comments and replies.
 * Contains comment content.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class CommentRequest {

    @NotBlank(message = "Comment content is required")
    private String content;
}