package com.toxictracker.repository;

import com.toxictracker.model.InstagramAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InstagramAccountRepository extends JpaRepository<InstagramAccount, Long> {
    Optional<InstagramAccount> findByUsername(String username);
}
