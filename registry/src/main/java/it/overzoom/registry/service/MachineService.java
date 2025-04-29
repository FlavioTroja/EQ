package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.dto.MachineDTO;
import it.overzoom.registry.model.Machine;

public interface MachineService {

    Page<Machine> findAll(Pageable pageable);

    Optional<MachineDTO> findById(String id);

    boolean existsById(String id);

    Machine create(Machine machine);

    Optional<Machine> update(Machine machine);

    Optional<Machine> partialUpdate(String id, Machine machine);

    void delete(String id);
}