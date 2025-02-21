package it.overzoom.registry.mapper;

import java.sql.Blob;
import java.util.Base64;

import it.overzoom.registry.dto.UserDTO;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.User;
import it.overzoom.registry.security.SecurityUtils;

public class UserMapper {

    public static UserDTO toDto(User user) {
        if (user == null) {
            return null;
        }
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUserId(user.getUserId());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setLevel(user.getLevel());

        Blob photoBlob = user.getPhoto();
        if (photoBlob != null) {
            try {
                int blobLength = (int) photoBlob.length();
                byte[] blobBytes = photoBlob.getBytes(1, blobLength);
                String photoBase64 = Base64.getEncoder().encodeToString(blobBytes);
                dto.setPhoto(photoBase64);
            } catch (Exception e) {
                dto.setPhoto(null);
            }
        }
        try {
            return SecurityUtils.populateKeycloakFields(dto);
        } catch (ResourceNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public static User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }
        User user = new User();
        user.setId(dto.getId());
        user.setUserId(dto.getUserId());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setLevel(dto.getLevel());
        return user;
    }
}
