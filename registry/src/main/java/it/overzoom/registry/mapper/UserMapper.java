package it.overzoom.registry.mapper;

import java.sql.Blob;
import java.util.Base64;

import javax.sql.rowset.serial.SerialBlob;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import it.overzoom.registry.dto.UserDTO;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.User;
import it.overzoom.registry.security.SecurityUtils;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "photo", target = "photo", qualifiedByName = "blobToBase64")
    @Mapping(target = "username",  ignore = true)
    @Mapping(target = "email",     ignore = true)
    @Mapping(target = "firstName", ignore = true)
    @Mapping(target = "lastName",  ignore = true)
    @Mapping(target = "roles",     ignore = true)
    UserDTO toDto(User user);

    @Mapping(source = "photo", target = "photo", qualifiedByName = "stringToBlob")
    User toEntity(UserDTO dto);

    @Named("blobToBase64")
    default String blobToBase64(Blob blob) {
        if (blob == null)
            return null;
        try {
            int length = (int) blob.length();
            byte[] bytes = blob.getBytes(1, length);
            return Base64.getEncoder().encodeToString(bytes);
        } catch (Exception e) {
            return null;
        }
    }

    @Named("stringToBlob")
    default Blob stringToBlob(String base64) {
        if (base64 == null)
            return null;
        try {
            byte[] bytes = Base64.getDecoder().decode(base64);
            return new SerialBlob(bytes);
        } catch (Exception e) {
            return null;
        }
    }

    @AfterMapping
    default void populateKeycloak(User user, @MappingTarget UserDTO dto) {
        try {
            SecurityUtils.populateKeycloakFields(dto);
        } catch (ResourceNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
