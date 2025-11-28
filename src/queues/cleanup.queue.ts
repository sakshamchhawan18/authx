// src/queues/cleanup.queue.ts
//import { Queue, QueueScheduler } from "bullmq";
import { redisConnection } from "../config/redis";

export const CLEANUP_QUEUE_NAME = "cleanup-queue";
//export const cleanupQueue = new Queue(CLEANUP_QUEUE_NAME, redisConnection);
//export const cleanupQueueScheduler = new QueueScheduler(CLEANUP_QUEUE_NAME, redisConnection);
