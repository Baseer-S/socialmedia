package com.baseer.social.service;

import com.baseer.social.dto.PostRequest;
import com.baseer.social.dto.PostResponse;
import com.baseer.social.entity.Post;
import com.baseer.social.entity.User;
import com.baseer.social.exceptionHandling.CustomException;
import com.baseer.social.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
     * ⭐ Now returns PostResponse (DTO) instead of Post (entity)
     */
    @Transactional
    public PostResponse createPost(PostRequest request) {
        User currentUser = userService.getCurrentUser();

        Post post = Post.builder()
                .user(currentUser)
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .likesCount(0)
                .commentsCount(0)
                .build();

        Post savedPost = postRepository.save(post);
        postRepository.flush();

        System.out.println("✅ Post created with ID: " + savedPost.getId());

        // Convert entity to DTO before returning
        return convertToDTO(savedPost);
    }

    /**
     * Get all posts (feed) with pagination
     * ⭐ Now returns Page<PostResponse> instead of Page<Post>
     */
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        System.out.println("=== getAllPosts called ===");
        System.out.println("Page: " + pageable.getPageNumber() + ", Size: " + pageable.getPageSize());

        // Fetch posts from database
        Page<Post> posts = postRepository.findAll(
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        Sort.by("createdAt").descending()
                )
        );

        System.out.println("Total posts in DB: " + posts.getTotalElements());
        System.out.println("Posts in this page: " + posts.getNumberOfElements());

        if (posts.isEmpty()) {
            System.out.println("⚠️ WARNING: No posts returned!");
        }

        // Convert Page<Post> to Page<PostResponse>
        return posts.map(this::convertToDTO);
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
     * ⭐ Now returns PostResponse instead of Post
     */
    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request) {
        Post post = getPostById(postId);
        User currentUser = userService.getCurrentUser();

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Unauthorized to update this post", HttpStatus.FORBIDDEN);
        }

        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());

        Post updatedPost = postRepository.save(post);

        // Convert to DTO before returning
        return convertToDTO(updatedPost);
    }

    /**
     * Delete post
     */
    @Transactional
    public void deletePost(Long postId) {
        Post post = getPostById(postId);
        User currentUser = userService.getCurrentUser();

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

    // ========================================
    // ⭐ NEW METHOD: Convert Post Entity to PostResponse DTO
    // ========================================

    /**
     * Convert Post entity to PostResponse DTO
     * This method extracts only the safe fields we want to send to frontend
     */
    private PostResponse convertToDTO(Post post) {
        // First, build the UserDTO (nested object)
        PostResponse.UserDTO userDTO = PostResponse.UserDTO.builder()
                .id(post.getUser().getId())
                .username(post.getUser().getUsername())
                .fullName(post.getUser().getFullName())
                .profilePicture(post.getUser().getProfilePicture())
                .build();

        // Then, build the PostResponse with the UserDTO inside
        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .createdAt(post.getCreatedAt())
                .user(userDTO)
                .build();
    }
}