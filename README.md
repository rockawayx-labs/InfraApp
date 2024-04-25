# Installation Guide
## Prerequisites
- Node.js
- Docker
- Docker Compose
- npm (usually installed with Node.js)

## Setup Instructions

### 1. Install Node.js
Node.js is required to run the application. Install Node.js (which includes npm) from the official [Node.js website](https://nodejs.org/).

### 2. Install Docker
Install Docker by following the instructions on the [official Docker documentation](https://docs.docker.com/get-docker/).

### 3. Install Docker Compose
Follow the instructions on the [Docker Compose documentation](https://docs.docker.com/compose/install/) to install Docker Compose.

### 4. Clone the Repository
Clone your repository to your local machine:

### 5. .env file
Copy .env file into InfraApp/infraapp

### 6. Install Dependencies
Run
npm install 
in InfraApp/infraapp

### 7. Generate prisma client
Run
npx prisma generate

### 8. Run database
docker-compose up -d
inside InfraApp folder to run PostreSQL db

### 9. Start application
npm run dev
inside InfraApp/infraapp folder
