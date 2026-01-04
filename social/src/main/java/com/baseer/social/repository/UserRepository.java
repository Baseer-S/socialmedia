package com.baseer.social.repository;

import com.baseer.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity.
 * Provides database operations for user management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username
     * @param username the username to search for
     * @return Optional containing user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email
     * @param email the email to search for
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username already exists
     * @param username the username to check
     * @return true if exists, false otherwise
     */
    Boolean existsByUsername(String username);

    /**
     * Check if email already exists
     * @param email the email to check
     * @return true if exists, false otherwise
     */
    Boolean existsByEmail(String email);
}