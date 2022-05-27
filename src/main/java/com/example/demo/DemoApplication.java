package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.*;

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
//		LoadBalancer loadBalancer = new LoadBalancer();
//		List<Integer> nodes = new ArrayList<Integer>();
//		nodes.add(1);
//		nodes.add(2);
//		nodes.add(3);
//		nodes.add(4);
//		loadBalancer.initializeQueue(nodes);
	}

}
