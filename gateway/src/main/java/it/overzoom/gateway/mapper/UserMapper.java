package it.overzoom.gateway.mapper;

import java.util.Map;

import it.overzoom.gateway.dto.UserDto;

public class UserMapper {

    public static UserDto mapRegistrationDataToUserDto(Map<String, Object> registrationData) {
        UserDto userDto = new UserDto();
        userDto.setUserId((String) registrationData.get("id"));
        userDto.setUsername((String) registrationData.get("username"));
        userDto.setFirstName((String) registrationData.get("firstName"));
        userDto.setLastName((String) registrationData.get("lastName"));
        userDto.setEmail((String) registrationData.get("email"));

        return userDto;
    }
}
