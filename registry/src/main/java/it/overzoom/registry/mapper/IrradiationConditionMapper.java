package it.overzoom.registry.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import it.overzoom.registry.dto.IrradiationConditionDTO;
import it.overzoom.registry.model.IrradiationCondition;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = { MeasurementMapper.class })
public interface IrradiationConditionMapper {
    IrradiationConditionDTO toDto(IrradiationCondition entity);

    IrradiationCondition toEntity(IrradiationConditionDTO dto);
}
