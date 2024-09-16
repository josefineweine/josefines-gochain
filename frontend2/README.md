Installation 📜
To run this project locally, follow these steps:

Clone the Repository:

bash
Copy code
git clone https://github.com/josefineweine/josefines-gochain.git
cd josefines-gochain
Install Dependencies:

For both the backend and frontend, install the required dependencies:

bash
Copy code
cd backend
npm install
cd ../frontend
npm install
Start Redis Server:

Ensure Redis is running by executing:

bash
Copy code
redis-server
Set Up MongoDB:

Make sure MongoDB is installed and running on your local machine.

Configure Environment Variables:

Create a .env file inside the backend/config directory with the following content:

env
Copy code
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
JWT_TTL=90d
JWT_COOKIE_TTL=90d
REDIS_HOST=localhost
REDIS_PORT=6379
Start the Backend and Frontend Servers:

Open two terminal windows or tabs and run the following commands in each:

Backend:

bash
Copy code
cd backend
npm run dev
Frontend:

bash
Copy code
cd frontend
npm run dev

Usage 
Register and Log In:

Create a new user account and log in to access blockchain features.

Create Transactions:

Use the client application to generate and send new transactions.

Mine Blocks:

Mine blocks to add transactions to the blockchain and earn rewards.

View the Blockchain:

Explore the blockchain to view transactions and monitor blocks.