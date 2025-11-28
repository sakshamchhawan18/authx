// src/queues/email.queue.ts
//import { Queue, QueueScheduler } from "bullmq";
import { redisConnection } from "../config/redis";

export const EMAIL_QUEUE_NAME = "email-queue";
//export const emailQueue = new Queue(EMAIL_QUEUE_NAME, redisConnection);

// Optional scheduler to enable delayed / repeatable jobs
//export const emailQueueScheduler = new QueueScheduler(EMAIL_QUEUE_NAME, redisConnection);
