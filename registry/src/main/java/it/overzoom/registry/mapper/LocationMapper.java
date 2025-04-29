package it.overzoom.registry.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.model.Location;

@Mapper(componentModel = "spring", uses = { DepartmentMapper.class })
public interface LocationMapper {

    @Mapping(target = "departments",         ignore = true)
    @Mapping(target = "completedDepartments", ignore = true)
    LocationDTO toDto(Location location);

    Location toEntity(LocationDTO dto);
}
