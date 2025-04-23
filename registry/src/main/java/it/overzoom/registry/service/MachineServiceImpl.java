package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.model.Machine;
import it.overzoom.registry.repository.MachineRepository;

@Service
public class MachineServiceImpl implements MachineService {

    @Autowired
    private MachineRepository machineRepository;

    @Override
    public Page<Machine> findAll(Pageable pageable) {
        return machineRepository.findAll(pageable);
    }

    @Override
    public Optional<Machine> findById(String id) {
        return machineRepository.findById(id);
    }

    @Override
    public boolean existsById(String id) {
        return machineRepository.existsById(id);
    }

    @Override
    public Machine create(Machine machine) {
        return machineRepository.save(machine);
    }

    @Override
    public Optional<Machine> update(Machine machine) {
        return this.findById(machine.getId()).map(existingMachine -> {
            existingMachine.setName(machine.getName());
            existingMachine.setType(machine.getType());
            return existingMachine;
        }).map(this::create);
    }

    @Override
    public Optional<Machine> partialUpdate(String id, Machine machine) {
        return this.findById(id)
                .map(existingMachine -> {
                    if (machine.getName() != null) {
                        existingMachine.setName(machine.getName());
                    }
                    if (machine.getType() != null) {
                        existingMachine.setType(machine.getType());
                    }
                    return existingMachine;
                })
                .map(this::create);
    }

    @Override
    public void delete(Machine machine) {
        machineRepository.delete(machine);
    }
}