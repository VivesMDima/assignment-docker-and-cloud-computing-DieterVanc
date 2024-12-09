package ti.vives.be.apitizers.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.FileInputStream;
import java.io.IOException;

public class FirebaseConfig {
    public static void initializeFirebase() throws IOException {
        // Load environment variables
        Dotenv dotenv = Dotenv.load();

        // Get the file path from the environment variable
        String keyPath = dotenv.get("FIREBASE_KEY_PATH");

        // Initialize Firebase with the key file
        FileInputStream serviceAccount = new FileInputStream(keyPath);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket(dotenv.get("FIREBASE_STORAGE_BUCKET"))
                .build();

        FirebaseApp.initializeApp(options);
    }
}