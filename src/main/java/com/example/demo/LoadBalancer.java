package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
@Service
public class LoadBalancer {
    @Value("#{${nodeMap}}")
    private Map<Integer,Integer> nodeMap;
    @Value("${leader}")
    private int leader;

    Queue<Integer> roundRobin = new LinkedList<Integer>();
    Boolean queueInitialized = Boolean.FALSE;
     int loadBalance(String request){
         if(request.equals("GET")) {
             int node = roundRobin.remove();
             roundRobin.add(node);
             int port = nodeMap.get(node);
             System.out.println("Request is being completed by " + port + "\nLoad balancer queue " + roundRobin);
             return port;
         }
         else {
             System.out.println("Request is being completed by " + leader);
             return nodeMap.get(leader);
         }

     }

     void initializeQueue() {
         List<Integer> nodes = new ArrayList<Integer>();
         nodes.add(1);
         nodes.add(2);
         nodes.add(3);
         for (int i = 0; i < nodes.size(); i++){
             roundRobin.add(nodes.get(i));
         }
         System.out.println("Node List " + roundRobin);
         queueInitialized = Boolean.TRUE;
     }
     void updateQueue(int newNode, int removeNode) {
         Iterator itr = roundRobin.iterator();
         while (itr.hasNext())
         {
             int data = (Integer)itr.next();
             if (data == removeNode)
                 itr.remove();
         }
         roundRobin.add(newNode);
         System.out.println("New Queue: " + roundRobin);
     }

    public Boolean getQueueInitialized() {
        return queueInitialized;
    }
    //     void processRequest(int id, String request) {
//         String address = nodeMap.get(id);
//         System.out.println("Node: "+id+" sending request to: " + address);
//     }
}
