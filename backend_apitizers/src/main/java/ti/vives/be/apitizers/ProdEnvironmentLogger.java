package ti.vives.be.apitizers;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
public class ProdEnvironmentLogger implements CommandLineRunner {

    @Override
    public void run(String... args) {
        System.out.println("Welcome to the Production Environment");
    }
}