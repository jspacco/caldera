package caldera.server;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Properties;

@Service
public class AuthenticationService
{

    @Value("${users.properties}")
    private String configFile;

    @Value("${dog.cat}")
    private String dogCat;

    private Properties properties;

    public AuthenticationService() throws IOException
    {
        System.out.println("\n\n\ndogcat:\n" + dogCat);
        System.out.println("\n\n\nHELLO:\n\n" + configFile);
        //Resource resource = new FileSystemResource(configFile);
        //this.properties = PropertiesLoaderUtils.loadProperties(resource);
        this.properties = new Properties();
        properties.put("jspacco", "12347");
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

