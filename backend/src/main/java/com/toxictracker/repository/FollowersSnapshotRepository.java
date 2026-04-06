package com.toxictracker.repository;

import com.toxictracker.model.FollowersSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowersSnapshotRepository extends JpaRepository<FollowersSnapshot, Long> {
    List<FollowersSnapshot> findByUserIdOrderByCreatedAtDesc(Long userId);
}
