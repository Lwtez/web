package org.example;

import com.fastcgi.FCGIInterface;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.io.PrintStream;

public class Main {
    public static void main(String[] args) {
        FCGIInterface fcgiInterface = new FCGIInterface();
        while (fcgiInterface.FCGIaccept() >= 0) {
            try {
                long startTime = System.nanoTime();
                String rRequest = readRequest();
                Map<String, String> parsedRequest = parseRequest(rRequest);

                float x = Float.parseFloat(parsedRequest.get("x"));
                float y = Float.parseFloat(parsedRequest.get("y"));

                String rs = parsedRequest.get("r");
                String[] rValues = rs.split(",");
                int[] rNumbers = Arrays.stream(rValues).mapToInt(Integer::parseInt).toArray();

                if (!validateX(x) || !validateY(y) || !validateRs(rNumbers)) {
                    sendResponse("error=invalid data");
                    continue;
                }

                List<String> responses = new ArrayList<>();
                for (int rVal : rNumbers) {
                    boolean isHitting = hit(x, y, rVal);
                    double executionTime = ((System.nanoTime() - startTime) / 1_000_000.0);
                    String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                    String createdResponse = String.format(Locale.US,
                            "x=%.1f;y=%f;r=%d;result=%b;time=%s;exec=%.2f",
                            x, y, rVal, isHitting, currentTime, executionTime
                    );
                    responses.add(createdResponse);
                }

                if (!responses.isEmpty()) {
                    sendResponse(String.join("\n", responses));
                }

            } catch (Exception e) {
                sendResponse("error=" + e.getMessage());
            }
        }
    }

    private static Map<String, String> parseRequest(String rRequest) throws IOException {
        Map<String, String> map = new HashMap<>();
        if (rRequest == null || rRequest.isEmpty()) return map;

        String[] pairs = rRequest.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=", 2);
            String key = URLDecoder.decode(keyValue[0], StandardCharsets.UTF_8);
            String value = keyValue.length > 1 ? URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8) : "";
            map.put(key, value);
        }
        return map;
    }

    private static String readRequest() throws IOException {
        try {
            FCGIInterface.request.inStream.fill();
            int contentLength = FCGIInterface.request.inStream.available();
            var buffer = ByteBuffer.allocate(contentLength);
            int readBytes = FCGIInterface.request.inStream.read(buffer.array(), 0, contentLength);
            var requestBodyRaw = new byte[readBytes];
            buffer.get(requestBodyRaw, 0, readBytes);
            buffer.clear();
            return new String(requestBodyRaw, StandardCharsets.UTF_8);
        } catch (NullPointerException e) {
            return "";
        }
    }

    private static boolean hit(float x, float y, int r) {
        if (x > 0 && y < 0) return false;
        if (x >= 0 && y >= 0) return x <= r && y <= -0.5 * x + r / 2.0;
        if (x <= 0 && y >= 0) return x >= -r && y <= r / 2.0;
        return x * x + y * y <= (r / 2.0) * (r / 2.0);
    }

    private static void sendResponse(String response) {
        PrintStream out = System.out;
        out.println("Content-Type: application/json\r");
        out.println();
        out.println(response);
        out.flush();
    }

    public static boolean validateX(float x) { return x >= -2 && x <= 2; }
    public static boolean validateY(float y) { return y >= -3 && y <= 3; }
    public static boolean validateRs(int[] rArray) {
        for (int r : rArray) if (r < 1 || r > 5) return false;
        return true;
    }
}
