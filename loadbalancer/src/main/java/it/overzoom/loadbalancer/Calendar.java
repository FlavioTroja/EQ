package it.overzoom.loadbalancer;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "CALENDAR")
public interface Calendar {

    @GetMapping("/api/calendar/today")
    public String today();
}
