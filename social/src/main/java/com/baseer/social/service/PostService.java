package com.baseer.social.service;

import com.baseer.social.dto.PostRequest;
import com.baseer.social.entity.Post;
import com.baseer.social.entity.User;
import com.baseer.social.exceptionHandling.CustomException;
import com.baseer.social.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for post operations.
 * Handles CRUD operations for posts.
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserService userService;

    /**
     * Create a new post
     */
    @Transactional
    public Post createPost(PostRequest request) {
        User currentUser = userService.getCurrentUser();

        Post post = Post.builder()
                .user(currentUser)
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .likesCount(0)
                .commentsCount(0)
                .build();

        return postRepository.save(post);
    }

    /**
     * Get all posts (feed) with pagination
     */
    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    /**
     * Get post by ID
     */
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException("Post not found", HttpStatus.NOT_FOUND));
    }

    /**
     * Get posts by user
     */
    public Page<Post> getUserPosts(Long userId, Pageable pageable) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    /**
     * Update post
     */
    @Transactional
    public Post updatePost(Long postId, PostRequest request) {
        Post post = getPostById(postId);
        User currentUser = userService.getCurrentUser();

        // Check if user owns the post
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Unauthorized to update this post", HttpStatus.FORBIDDEN);
        }

        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());

        return postRepository.save(post);
    }

    /**
     * Delete post
     */
    @Transactional
    public void deletePost(Long postId) {
        Post post = getPostById(postId);
        User currentUser = userService.getCurrentUser();

        // Check if user owns the post
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Unauthorized to delete this post", HttpStatus.FORBIDDEN);
        }

        postRepository.delete(post);
    }

    /**
     * Increment likes count
     */
    @Transactional
    public void incrementLikesCount(Long postId) {
        Post post = getPostById(postId);
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
    }

    /**
     * Decrement likes count
     */
    @Transactional
    public void decrementLikesCount(Long postId) {
        Post post = getPostById(postId);
        post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        postRepository.save(post);
    }

    /**
     * Increment comments count
     */
    @Transactional
    public void incrementCommentsCount(Long postId) {
        Post post = getPostById(postId);
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);
    }
}