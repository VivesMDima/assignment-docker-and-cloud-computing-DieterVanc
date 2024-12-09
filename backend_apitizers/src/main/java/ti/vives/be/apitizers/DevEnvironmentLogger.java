package ti.vives.be.apitizers;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DevEnvironmentLogger implements CommandLineRunner {

    @Override
    public void run(String... args) {
        System.out.println("Welcome to the Development Environment");
    }
}