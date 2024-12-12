package ti.vives.be.apitizers.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import java.io.FileInputStream;
import java.io.IOException;

public class FirebaseConfig {
    public static void initializeFirebase() throws IOException {

        // Get the file path from the environment variable
        String keyPath = System.getenv("FIREBASE_KEY_PATH");

        // Initialize Firebase with the key file
        FileInputStream serviceAccount = new FileInputStream(keyPath);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket(System.getenv("FIREBASE_STORAGE_BUCKET"))
                .build();

        FirebaseApp.initializeApp(options);
    }
}