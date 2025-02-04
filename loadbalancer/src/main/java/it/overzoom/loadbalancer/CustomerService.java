package it.overzoom.loadbalancer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomerService {

    @Autowired
    private Calendar calendar;

    @GetMapping("/gethello")
    public String getMethodName() {
        String res = calendar.hello();
        return "ciao " + res;
    }

}
