
# Medical Bill & Insurance Audit AI (HackNitr7.O)

An intelligent platform designed to demystify medical bills, analyze insurance coverage, and detect overbilling using advanced AI. This tool helps patients and auditors understand hospital charges, verify medical necessity, and streamline the insurance claim process.

## 🚀 Key Features

*   **🏥 Bill Simplifier**: Upload complex hospital bills to receive a simplified, easy-to-understand breakdown of charges.
*   **📊 Cost Analysis**: Compare hospital bills against insurance policies to identify discrepancies, overcharged items, and potential savings.
*   **📜 Policy Coverage Check**: Verify if specific treatments or procedures are covered under the uploaded insurance policy.
*   **🩺 Medical Necessity Verification**: Analyze clinical notes to determine if performed procedures meet medical necessity criteria, aiding in claim approvals.
*   **❌ Denial & Appeal Support**: Analyze denial letters against medical documents and policy details to formulate strong appeal arguments.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (Vite) + TypeScript
*   **Styling**: Tailwind CSS (v4)
*   **Animations**: Framer Motion, GSAP
*   **State Management/Data**: React Query (implied) / Axios
*   **Icons**: Lucide React
*   **Routing**: React Router DOM

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose)
*   **AI Engine**: Perplexity API (Sonar Pro)
*   **Auth**: Firebase Admin + JWT
*   **File Handling**: Multer (Memory Storage)
*   **Document Processing**: PDF-Parse
*   **Security**: BCrypt, CORS

## 📂 Project Structure

```
HackNitr7.O/
├── frontend/          # React + Vite Client Application
├── backend/           # Node.js + Express API Server
└── README.md          # Project Documentation
```

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB (Local or Atlas)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/HackNitr7.O.git
    cd HackNitr7.O
    ```

2.  **Setup the Backend**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend/` directory with the following variables:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        PERPLEXITY_API_KEY=your_perplexity_api_key
        # Add other specific API keys used (e.g. Firebase credentials)
        ```
    *   Start the server:
        ```bash
        npm start
        # OR for development
        nodemon server.js
        ```

3.  **Setup the Frontend**
    ```bash
    cd frontend
    npm install
    ```
    *   Start the development server:
        ```bash
        npm run dev
        ```

### Usage
1.  Open your browser and navigate to `http://localhost:5173` (default Vite port).
2.  Upload your Medical Bill (PDF) and Insurance Policy (PDF) in the respective analysis tabs.
3.  View the AI-generated insights, cost breakdowns, and coverage suggestions.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request with your features or fixes.

## 📄 License
This project is licensed under the ISC License.
