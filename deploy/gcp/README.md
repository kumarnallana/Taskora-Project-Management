# Taskora on Google Cloud

Use Cloud Build to produce separate web and API images in Artifact Registry. Deploy both images to Cloud Run in the same region. Connect the API service to Cloud SQL for PostgreSQL and supply `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN` from Secret Manager.

Run `prisma migrate deploy` as a Cloud Run Job with the API image before promoting a release. Keep the API reachable only through the external Application Load Balancer. Configure two serverless network endpoint groups and route `/api/*` to the API service and all other paths to the web service. Set `CLIENT_ORIGIN` to the load balancer's public HTTPS origin and build the web image with `API_INTERNAL_URL` set to the internal API origin.

Enable Cloud SQL automated backups, Cloud Run request logs, error reporting, and uptime monitoring. The application health endpoint is `/api/health`.
