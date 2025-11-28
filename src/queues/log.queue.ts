// src/queues/log.queue.ts
//import { Queue, QueueScheduler } from "bullmq";
import { redisConnection } from "../config/redis";

export const LOG_QUEUE_NAME = "log-queue";
//export const logQueue = new Queue(LOG_QUEUE_NAME, redisConnection);
//export const logQueueScheduler = new QueueScheduler(LOG_QUEUE_NAME, redisConnection);
