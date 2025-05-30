package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.dto.MachineDTO;
import it.overzoom.registry.mapper.MachineMapper;
import it.overzoom.registry.model.Machine;
import it.overzoom.registry.repository.MachineRepository;

@Service
public class MachineServiceImpl implements MachineService {

    private final MachineRepository machineRepository;
    private final CustomerService customerService;
    private final MachineMapper machineMapper;

    public MachineServiceImpl(MachineRepository machineRepository, CustomerService customerService,
            MachineMapper machineMapper) {
        this.machineRepository = machineRepository;
        this.customerService = customerService;
        this.machineMapper = machineMapper;
    }

    @Override
    public Page<Machine> findAll(Pageable pageable) {
        return machineRepository.findAll(pageable);
    }

    @Override
    public Optional<MachineDTO> findById(String id) {
        return machineRepository.findById(id)
                .map(machine -> {
                    MachineDTO dto = machineMapper.toDto(machine);
                    List<CustomerDTO> customers = customerService.findCustomersByMachine(id);
                    dto.setCustomers(customers);
                    return dto;
                });
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
        return machineRepository.findById(machine.getId()).map(existingMachine -> {
            existingMachine.setName(machine.getName());
            existingMachine.setType(machine.getType());
            return existingMachine;
        }).map(this::create);
    }

    @Override
    public Optional<Machine> partialUpdate(String id, Machine machine) {
        return machineRepository.findById(id)
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
    public void delete(String id) {
        machineRepository.deleteById(id);
    }
}