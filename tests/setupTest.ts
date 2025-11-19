import request from "supertest";
import app from "../src/app";

// Supertest instance for calling the API
export const api = request(app);
