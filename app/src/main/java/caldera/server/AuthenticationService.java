package caldera.server;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.util.Properties;

@Service
public class AuthenticationService implements ApplicationListener<ContextRefreshedEvent>
{
    @Value("${caldera.users.file:./config/users.properties}")
    private String userPasswordFile;

    private int shutdownCode = 0;
    
    private final LoadPropertiesService loadPropertiesService;
    private final ApplicationContext applicationContext;

    @Autowired
    public AuthenticationService(LoadPropertiesService loadPropertiesService, ApplicationContext applicationContext)
    {
        this.loadPropertiesService = loadPropertiesService;
        this.applicationContext = applicationContext;
    }


    private Properties properties;

    @PostConstruct
    public void init() throws IOException
    {
        if (userPasswordFile == null)
        {
            properties = loadPropertiesService.loadProperties("users.properties");
        }
        else
        {
            Resource resource = new FileSystemResource(userPasswordFile);
            this.properties = PropertiesLoaderUtils.loadProperties(resource);
        }

        if (properties.size() == 0)
        {
            shutdownCode = 1;
        }
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

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (shutdownCode == 1)
        {
            System.err.println("No users found in config/users.properties, so students will not be able to upload events. Please fix!");
            SpringApplication.exit(applicationContext, new ExitCodeGenerator() {
                @Override
                public int getExitCode() {
                    System.err.println("\n\n\nNo users found in config/users.properties, so students will not be able to upload events. Please fix and restart the server!\n\n\n");
                    return 1;
                }
            });
        }
    }
}

