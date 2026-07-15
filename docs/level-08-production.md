# Level 8 — Scalability / AWS 🟤

> **Goal:** Deploy and scale AI-assisted applications on AWS. Learn cloud-native patterns, auto-scaling, and production monitoring.
>
> **Difficulty:** Advanced | **Projects:** 3 | **Estimated time:** 5-6 hours

## Skills you'll gain

- [ ] Deploy Node.js apps to AWS with AI
- [ ] Configure auto-scaling
- [ ] Set up monitoring and alerting
- [ ] Implement caching strategies
- [ ] Optimize database performance

---

## Project 1: Deploy to AWS

**Description:** Deploy the microservices from Level 7 to AWS using AI-generated infrastructure code.

### Steps

1. Ask Copilot: *"Create a CloudFormation or CDK template that deploys the 3 microservices from Level 7 to AWS ECS Fargate."*
2. Add a load balancer: *"Add an Application Load Balancer in front of the services."*
3. Add a database: *"Add an RDS PostgreSQL instance and configure the services to use it."*
4. Add environment variables: *"Configure environment variables for each service (DB URL, API keys, etc.)."*

### Completion criteria

- [ ] Infrastructure template is valid
- [ ] Services deploy to ECS Fargate
- [ ] Load balancer routes traffic correctly
- [ ] Database is connected

---

## Project 2: Auto-scaling and caching

**Description:** Add auto-scaling and caching to the deployed system.

### Steps

1. Ask Copilot: *"Add auto-scaling configuration to the ECS services based on CPU and memory usage."*
2. Add ElastiCache: *"Add a Redis ElastiCache cluster and configure the services to use it for caching."*
3. Add CDN: *"Add CloudFront in front of the load balancer for static asset caching."*
4. Test scaling: *"Create a load testing script that simulates traffic and verify auto-scaling works."*

### Completion criteria

- [ ] Auto-scaling is configured
- [ ] Redis caching is implemented
- [ ] CloudFront is configured
- [ ] Load test shows scaling works

---

## Project 3: Monitoring and alerting

**Description:** Set up production monitoring and alerting.

### Steps

1. Ask Copilot: *"Create CloudWatch dashboards for the 3 microservices showing: request count, error rate, latency (p50, p95, p99), and CPU/memory usage."*
2. Add alerts: *"Create CloudWatch alarms for: error rate > 5%, p99 latency > 2s, CPU > 80%."*
3. Add structured logging: *"Add structured JSON logging to all services with correlation IDs."*
4. Add log aggregation: *"Configure CloudWatch Logs Insights queries for common debugging scenarios."*

### Completion criteria

- [ ] Dashboards show all key metrics
- [ ] Alarms are configured with correct thresholds
- [ ] Structured logging is implemented
- [ ] Log queries work for debugging

---

## Self-review

Before advancing to Level 9, answer:

- Can you deploy a Node.js app to AWS with AI-generated infrastructure?
- Do you understand auto-scaling and caching strategies?
- Can you set up production monitoring and alerting?

→ If you answered "yes" to all, advance to **Level 9**.
