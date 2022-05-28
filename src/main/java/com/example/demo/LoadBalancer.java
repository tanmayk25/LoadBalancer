package com.example.demo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
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
             log.info("Load Balancer: Request is being completed by {}", node);
             log.info("Load Balancer: Queue {}", roundRobin);
             return port;
         }
         else {
             log.info("Load Balancer: Request is being completed by {}", leader);
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
         log.info("Load Balancer: Node list {}", roundRobin);
     }
     void updateQueue(int removeNode) {
         Iterator itr = roundRobin.iterator();
         while (itr.hasNext())
         {
             int data = (Integer)itr.next();
             if (data == removeNode)
                 itr.remove();
         }
         log.info("Load Balancer: New Queue {}", roundRobin);
     }

     void updateNodeMap(int removeNode) {
         nodeMap.remove(removeNode);
         log.info("Load Balancer: Node Map Updated {}", nodeMap);
     }

    public void setLeader(int leader) {
        this.leader = leader;
        updateQueue(leader);
    }

    public int getLeader() {
        return leader;
    }




}
