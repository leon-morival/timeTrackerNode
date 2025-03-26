# Time Tracker Application

This application tracks time spent on different websites.

## Running the Application

You can run this application in two ways:

### Method 1: Using Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed on your system
2. Edit the `.env` file and uncomment the line `# DB_HOST=mysql`
3. Run the application with Docker Compose:

```bash
docker-compose up
```

This will start both the Node.js application and the MySQL database.

### Method 2: Running Locally

1. Install MySQL locally and make sure it's running
2. Create a database named "timetracker"
3. In the `.env` file, make sure `DB_HOST=localhost` is set (not "mysql")
4. Ensure DB_USER, DB_PASSWORD match your local MySQL credentials
5. Install dependencies:

```bash
npm install
```

6. Run the application:

```bash
node server.js
```

## Troubleshooting

### Database Connection Issues

- If using Docker: Make sure both containers are running with `docker-compose ps`
- If running locally: Verify MySQL is running and credentials are correct
- Check the `.env` file to ensure DB_HOST is correct for your setup

### Database Schema

The database schema is automatically created:

- In Docker Compose: using the init.sql file
- Locally: make sure to import the init.sql file manually if needed
