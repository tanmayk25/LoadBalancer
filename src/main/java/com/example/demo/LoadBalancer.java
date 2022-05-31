package com.example.demo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.*;

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

    private int nextNodeId;
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
         roundRobin.add(1);
//         List<Integer> nodes = new ArrayList<Integer>();
//         nodes.add(1);
////         nodes.add(2);
////         nodes.add(3);
//         for (int i = 0; i < nodes.size(); i++){
//             roundRobin.add(nodes.get(i));
//         }
         nextNodeId = 2;
         log.info("Load Balancer: Node list {}", roundRobin);
     }
     void removeFromQueue(int removeNode) {
         Iterator itr = roundRobin.iterator();
         while (itr.hasNext())
         {
             int data = (Integer)itr.next();
             if (data == removeNode)
                 itr.remove();
         }
         log.info("Load Balancer: Node Removed. New Queue {}", roundRobin);
     }

     void addToQueue() {
         roundRobin.add(nextNodeId);
         log.info("Load Balancer: New Node added. ID: {}", nextNodeId);
         nextNodeId += 1;
     }

     void removeFromNodeMap(int removeNode) {
         nodeMap.remove(removeNode);
         log.info("Load Balancer: Node Map Updated {}", nodeMap);
     }

    void addToNodeMap(int port) {
        nodeMap.put(nextNodeId, port);
        log.info("Load Balancer: Node added. New Node Map {}", nodeMap);
    }
    public void setLeader(int leader) {
        this.leader = leader;
        removeFromQueue(leader);
    }

    public int getLeader() {
        return leader;
    }
    public int getLeaderPort() {
        return nodeMap.get(leader);
    }


    public int getNextNodeId() {
        return nextNodeId;
    }

    public Map<Integer, Integer> getNodeMap() {
        return nodeMap;
    }
}
