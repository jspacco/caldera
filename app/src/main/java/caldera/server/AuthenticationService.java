package caldera.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

@Service
public class AuthenticationService
{
    @Value("${caldera.users.file:./config/users.properties}")
    private String userPasswordFile;
    
    private LoadPropertiesService loadPropertiesService;

    @Autowired
    public AuthenticationService(LoadPropertiesService loadPropertiesService)
    {
        this.loadPropertiesService = loadPropertiesService;
    }


    private Properties properties;

    @PostConstruct
    public void init() throws IOException
    {
        if (userPasswordFile == null)
        {
            properties = loadPropertiesService.loadProperties("users.properties");
            return;
        }
        // Path path = Paths.get(userPasswordFile);
        // if (!Files.exists(path) || !Files.isRegularFile(path))
        // {
        //     throw new IllegalArgumentException("caldera.user.password.file must be set");
        // }
        Resource resource = new FileSystemResource(userPasswordFile);
        this.properties = PropertiesLoaderUtils.loadProperties(resource);
    }

    public boolean authenticateUser(String username, String key)
    {
        if (username == null || key == null)
        {
            return false;
        }
        // checking backwards because we know the key is not null
        // but looking up the username may return null
        return key.equals(properties.getProperty(username));
    }
}

