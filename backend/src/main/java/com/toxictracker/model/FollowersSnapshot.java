package com.toxictracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowersSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToMany
    @JoinTable(
        name = "snapshot_followers",
        joinColumns = @JoinColumn(name = "snapshot_id"),
        inverseJoinColumns = @JoinColumn(name = "instagram_account_id")
    )
    private Set<InstagramAccount> followers;

    @ManyToMany
    @JoinTable(
        name = "snapshot_following",
        joinColumns = @JoinColumn(name = "snapshot_id"),
        inverseJoinColumns = @JoinColumn(name = "instagram_account_id")
    )
    private Set<InstagramAccount> following;

    private String ipAddress;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
