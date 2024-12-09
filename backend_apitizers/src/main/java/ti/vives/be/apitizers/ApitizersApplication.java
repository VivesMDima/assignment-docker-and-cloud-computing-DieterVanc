package ti.vives.be.apitizers;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import ti.vives.be.apitizers.config.FirebaseConfig;

import java.io.IOException;

@SpringBootApplication
public class ApitizersApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("DATABASE_URL", dotenv.get("DATABASE_URL"));
		System.setProperty("DATABASE_USERNAME", dotenv.get("DATABASE_USERNAME"));
		System.setProperty("DATABASE_PASSWORD", dotenv.get("DATABASE_PASSWORD"));

		SpringApplication.run(ApitizersApplication.class, args);
		try {
			FirebaseConfig.initializeFirebase();
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1); // Exit if Firebase fails to initialize
		}
	}

}
