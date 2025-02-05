package it.overzoom.loadbalancer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomerService {

    @Autowired
    private Calendar calendar;

    @GetMapping("/today")
    public String getMethodName() {
        String res = calendar.today();
        return "today: " + res;
    }

}
