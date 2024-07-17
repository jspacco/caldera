package caldera;

import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;

public class Response
{
    private ResponseCode responseCode;
    private String message;

    public Response(ResponseCode responseCode, String message)
    {
        this.responseCode = responseCode;
        this.message = message;
    }

    public ResponseCode getResponseCode()
    {
        return responseCode;
    }

    public String getMessage()
    {
        return message;
    }

    public String toJson()
    {
        Map<String, Object> map = new HashMap<>();
        map.put("responseCode", responseCode);
        map.put("message", message);
        return new Gson().toJson(map);
    }

    public static Response fromJson(String json)
    {
        Map<String, Object> map = new Gson().fromJson(json, Map.class);
        return new Response(ResponseCode.valueOf((String) map.get("responseCode")), (String) map.get("message"));
    }

    @Override
    public String toString()
    {
        return "Response: " + responseCode + " (" + message + ")";
    }
}
