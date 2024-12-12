package ti.vives.be.apitizers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import ti.vives.be.apitizers.config.FirebaseConfig;

import java.io.IOException;

@SpringBootApplication
public class ApitizersApplication {

	public static void main(String[] args) {

		SpringApplication.run(ApitizersApplication.class, args);
		try {
			FirebaseConfig.initializeFirebase();
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1); // Exit if Firebase fails to initialize
		}
	}

}
