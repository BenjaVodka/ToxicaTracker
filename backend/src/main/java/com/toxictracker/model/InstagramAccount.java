package com.toxictracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "instagram_accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstagramAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String profilePicUrl;

    private LocalDateTime lastSeenAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastSeenAt = LocalDateTime.now();
    }
}
