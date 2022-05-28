package com.example.demo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@RestController
@Slf4j
public class LoadBalancerController {

    @Autowired
    LoadBalancer loadBalancer;

    @GetMapping("/node/leader/{leader}")
    public ResponseEntity<Integer> setLeader(@PathVariable int leader) {
        log.info("Load Balancer: Setting Leader to {}", leader);
        loadBalancer.setLeader(leader);
        return ResponseEntity.ok(loadBalancer.getLeader());
    }

    @GetMapping("/node/remove/{nodeid}")
    public ResponseEntity removeNode (@PathVariable int nodeid) {
        loadBalancer.updateQueue(nodeid);
        loadBalancer.updateNodeMap(nodeid);
        return ResponseEntity.ok().build();
    }
    @RequestMapping("/document/**")
    public ResponseEntity mirrorRest(@RequestBody(required = false) String body,
                                     HttpMethod method, HttpServletRequest request, HttpServletResponse response)
            throws URISyntaxException {
        String requestUrl = request.getRequestURI();
        int port = loadBalancer.loadBalance(method.toString());
        URI uri = new URI("http", null, "localhost", port, null, null, null);
        uri = UriComponentsBuilder.fromUri(uri)
                .path(requestUrl)
                .query(request.getQueryString())
                .build(true).toUri();

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.set(headerName, request.getHeader(headerName));
        }

        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.exchange(uri, method, httpEntity, String.class);
        } catch(HttpStatusCodeException e) {
            return ResponseEntity.status(e.getRawStatusCode())
                    .headers(e.getResponseHeaders())
                    .body(e.getResponseBodyAsString());
        }
    }
}
