package it.overzoom.registry.mapper;

import org.mapstruct.Mapper;

import it.overzoom.registry.dto.DepartmentDTO;
import it.overzoom.registry.model.Department;

@Mapper(componentModel = "spring", uses = { SourceMapper.class })
public interface DepartmentMapper {

    DepartmentDTO toDto(Department department);

    Department toEntity(DepartmentDTO dto);
}
