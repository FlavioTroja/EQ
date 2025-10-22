package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.dto.MachineDTO;
import it.overzoom.registry.mapper.CustomerMapper;
import it.overzoom.registry.mapper.MachineMapper;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Machine;
import it.overzoom.registry.repository.MachineRepository;

@Service
public class MachineServiceImpl implements MachineService {

    private final MachineRepository machineRepository;
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;
    private final MachineMapper machineMapper;

    public MachineServiceImpl(MachineRepository machineRepository, CustomerService customerService,
            CustomerMapper customerMapper, MachineMapper machineMapper) {
        this.machineRepository = machineRepository;
        this.customerService = customerService;
        this.customerMapper = customerMapper;
        this.machineMapper = machineMapper;
    }

    @Override
    public Page<Machine> findAll(Pageable pageable) {
        return machineRepository.findAll(pageable);
    }

    /**
     * Implementazione dell'autocomplete: cerca tutte le macchine il cui nome contiene
     * la stringa 'name' (ignorando maiuscole/minuscole), paginato.
     */
    @Override
    public Page<Machine> searchByName(String name, Pageable pageable) {
        return machineRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Override
    public Optional<MachineDTO> findById(String id) {
        return machineRepository.findById(id)
                .map(machine -> {
                    MachineDTO dto = machineMapper.toDto(machine);
                    List<Customer> customers = customerService.findCustomersByMachine(id);
                    dto.setCustomers(customers.stream().map(customerMapper::toDto).collect(Collectors.toList()));
                    return dto;
                });
    }

    @Override
    public boolean existsById(String id) {
        return machineRepository.existsById(id);
    }

    @Override
    @Transactional
    public Machine create(Machine machine) {
        return machineRepository.save(machine);
    }

    @Override
    @Transactional
    public Optional<Machine> update(Machine machine) {
        return machineRepository.findById(machine.getId()).map(existingMachine -> {
            existingMachine.setName(machine.getName());
            existingMachine.setType(machine.getType());
            return existingMachine;
        }).map(this::create);
    }

    @Override
    @Transactional
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
    @Transactional
    public void delete(String id) {
        machineRepository.deleteById(id);
    }
}