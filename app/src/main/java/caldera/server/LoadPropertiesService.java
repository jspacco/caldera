package caldera.server;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

@Service
public class LoadPropertiesService
{
    private ResourceLoader resourceLoader;
    
    @Autowired
    public LoadPropertiesService(ResourceLoader resourceLoader)
    {
        this.resourceLoader = resourceLoader;
    }

    public Properties loadProperties(String filename) throws IOException
    {
        Properties properties = new Properties();

        String[] locations = {
            "file:./config",    // /config subdirectory of the current directory
            "file:.",           // current directory
            "classpath:/config", // /config subdirectory of the classpath
            "classpath:"        // root of the classpath
        };

        for (String location : locations) {
            Resource resource = resourceLoader.getResource(location + File.pathSeparator + filename);
            if (resource.exists()) {
                properties.load(resource.getInputStream());
                //System.out.println("Loaded configuration from: " + location);
                return properties;
            }
        }

        throw new IOException(filename + " file not found in any of the expected locations.");
    }
    
}
