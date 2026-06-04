
package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Raj Platform Spring Boot Template";
    }

    @GetMapping("/health")
    public String health() {
        return "UP";
    }
}
