package com.baseer.social.exceptionHandling;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Custom exception class for application-specific errors.
 * Includes HTTP status code for proper API responses.
 */
@Getter
public class CustomException extends RuntimeException {

    private final HttpStatus status;

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public CustomException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }
}