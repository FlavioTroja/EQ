package it.overzoom.registry.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;

import it.overzoom.registry.dto.DepartmentDTO;
import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.dto.SourceDTO;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.model.Source;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    LocationDTO toDto(Location location);

    DepartmentDTO map(Department department);

    SourceDTO map(Source source);

    default List<SourceDTO> mapSources(List<Source> sources) {
        return sources.stream()
                .map(this::map)
                .collect(Collectors.toList());
    }
}
