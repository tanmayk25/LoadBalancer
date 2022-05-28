package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LoadBalancer {
    private Map<Integer,Integer> nodeMap;
    @Value("#{${nodeMap}}")
    public void setNodeMap(Map<Integer, Integer> nodeMap) {
        this.nodeMap = new HashMap<>(nodeMap);
    }

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
     @EventListener(ApplicationReadyEvent.class)
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
     void updateQueue(int removeNode) {
         Iterator itr = roundRobin.iterator();
         while (itr.hasNext())
         {
             int data = (Integer)itr.next();
             if (data == removeNode)
                 itr.remove();
         }
         System.out.println("New Queue: " + roundRobin);
     }

     void updateNodeMap(int removeNode) {
         nodeMap.remove(removeNode);
         System.out.println("Node map updated" + nodeMap);
     }
    public Boolean getQueueInitialized() {
        return queueInitialized;
    }

    public void setLeader(int leader) {
        this.leader = leader;
        updateQueue(leader);
    }

    public int getLeader() {
        return leader;
    }




}
