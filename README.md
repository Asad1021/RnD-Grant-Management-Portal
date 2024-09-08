# Summary

Designed a web-based application to fulfill the purpose of automated research grant management. Necessary functions such as the generation of summary, commenting on problematic rows, searching, etc. were implemented to reduce the human effort involved and to provide a smooth user experience.

## Salient Features

Google OAuth-based login along with email and OTP<br>
Authorization of users as Professors or Admins or Fellows <br>
Searching Capabilities on Project Lists by different attributes <br>
Automatic summary table generation and updation <br>
Easy deletion and insertion of expense rows <br>
Commenting feature for each row of both the tables <br>
Appropriate checks are imposed to avoid erroneous inputs(such as expenditure exceeding the sanctioned amount) <br>
Implemented functionalities to incorporate the conversion of committed expenses to possibly different actual expenses <br>
Exporting the contents of expenditure and summary table as an Excel file. <br>
Division of funds and expenses into 2 major heads of Recurring and Non-Recurring with a focus on different subheads as well. <br>
The total balance of a project may temporarily be negative as long as the expenditure does not exceed the sanctioned amount. <br>
<br>
<be>

## Running the Web App

Kindly run the web app by running the following link
http://172.30.8.214

## Running the Web App Locally

To run this web application locally, follow these steps:

1. **Clone the Repository or Download the Zip File:**
   - Clone the repository
   - Or download and extract the zip file.
   - In the frontend folder, create a new `.env` file with the following contents:
     ```
     REACT_APP_SERVER_URL=http://localhost:5000
     ```
   - In the backend folder, create a new `.env` file with the following contents:
     ```
     DB_HOST="localhost"
     DB_PORT=5432
     DB_USER="postgres"
     DB_NAME="rnd_modified"
     DB_PASSWORD="alam1021"
     EMAIL_PASSWORD="zuri gerf aymx oceo"
     ```

2. **Open Two Terminals in the Same Folder:**
   - Open two terminal windows or tabs in the folder where you cloned or extracted the repository.

3. **Terminal 1 (Frontend):**
   - Navigate to the frontend directory by entering `cd ./frontend` in Terminal 1.
   - Install all the dependencies by running `npm i`.
   - If an error occurs during installation, try `npm i --f`.
   - Once dependencies are installed, start the frontend server by running `npm run`.

4. **Terminal 2 (Backend):**
   - Navigate to the backend directory by entering `cd ./backend` in Terminal 2.
   - Install all the dependencies by running `npm i`.
   - Once all dependencies are installed, start the backend server by running `npm run`.

Now, you should have both the frontend and backend servers running locally. You can access the web application by opening a web browser and navigating to `http://localhost:3000`.



