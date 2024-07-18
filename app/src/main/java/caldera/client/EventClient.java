package caldera.client;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import caldera.server.Event;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;


public class EventClient
{

    public static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final OkHttpClient client = new OkHttpClient();
    private ObjectMapper objectMapper;

    public EventClient()
    {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    public String postEvent(String url, Event event, String username, String password) throws Exception
    {
        String json = objectMapper.writeValueAsString(event);
        RequestBody body = RequestBody.create(json, JSON);

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("X-username", username)
                .addHeader("X-password", password)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            return response.body().string();
        }
    }

    public static void main(String[] args) throws Exception
    {
        String username = "jspacco";
        String password = "12347";
        //String password = "12348";
        
        EventClient client = new EventClient();
        Event event = new Event("Battle of Shitbird", 
            "The battle of Shitbird was a disaster for the Shitbirdians",
            "Shit",
            "2024-07-17",
            "My Arse",
            "jspacco",
            "battle", "england", "medieval");
        String url = "http://localhost:8081/events";
        String response = client.postEvent(url, event, username, password);
        System.out.println(response);
    }
}

