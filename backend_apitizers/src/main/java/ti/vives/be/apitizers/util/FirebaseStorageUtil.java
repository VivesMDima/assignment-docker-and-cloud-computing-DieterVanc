package ti.vives.be.apitizers.util;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class FirebaseStorageUtil {

    public static String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Get the Firebase Storage bucket
        Bucket bucket = StorageClient.getInstance().bucket();

        // Generate a unique token for the file
        String downloadToken = UUID.randomUUID().toString();

        // Set metadata
        Map<String, String> metadata = new HashMap<>();
        metadata.put("firebaseStorageDownloadTokens", downloadToken);

        // Create the blob with metadata
        BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), fileName)
                .setContentType(file.getContentType())
                .setMetadata(metadata)
                .build();


        // Upload the file to Firebase Storage
        Blob blob = bucket.create(fileName, file.getBytes(), file.getContentType());

        // Generate the download URL
        String downloadUrl = String.format(
                "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media&token=%s",
                bucket.getName(),
                URLEncoder.encode(fileName, StandardCharsets.UTF_8),
                downloadToken
        );

        // Return the public download URL
        return downloadUrl;
    }
}
