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

    // @AfterMapping
    // protected void enrichWithCustomers(Machine machine, @MappingTarget MachineDTO dto) {
    //     List<CustomerDTO> customers = customerService.findCustomersByMachine(machine.getId());
    //     dto.setCustomers(customers);
    // }
}
