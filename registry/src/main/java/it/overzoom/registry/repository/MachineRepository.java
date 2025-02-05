package it.overzoom.registry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.domain.Machine;

@Repository
public interface MachineRepository extends JpaRepository<Machine, String> {

}
