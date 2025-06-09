package it.overzoom.registry.mapper;

import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.dto.MachineDTO;
import it.overzoom.registry.model.Machine;
import it.overzoom.registry.service.CustomerService;

@Mapper(componentModel = "spring")
public abstract class MachineMapper {

    @Autowired
    protected CustomerService customerService;

    @Autowired
    protected CustomerMapper customerMapper;

    @Mapping(target = "customers", ignore = true)
    public abstract MachineDTO toDto(Machine machine);

    /**
     * Questa callback verrà evocata da toDto(...), perché non “vede”
     * toDtoWithoutCustomers(...)
     * (ogni mapping method invoca tutti gli @AfterMapping a meno che il target non
     * sia ignorato).
     */
    @AfterMapping
    protected void enrichWithCustomers(Machine machine, @MappingTarget MachineDTO dto) {
        List<CustomerDTO> customers = customerService.findCustomersByMachine(machine.getId());
        dto.setCustomers(customers);
    }
}
