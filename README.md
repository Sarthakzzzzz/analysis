# ASTRA - Centralized Vulnerability Detection System

A responsive cybersecurity dashboard prototype with dark theme and neon accents.

## Features

- **Role-Based Authentication** - Login as Analyst, Auditor, or Admin
- **Interactive Dashboard** - Real-time vulnerability stats, threat monitoring
- **Scanner Control** - Configure and run security scans (Nmap, OpenVAS, Nessus, etc.)
- **File Upload & Preview** - Drag-and-drop support for JSON, XML, LOG, TXT files
- **AI Assistant** - RAG-powered chatbot for security queries
- **Reports & Analytics** - CVE tracking, CVSS scoring, attack path visualization
- **Quick Actions** - Block IPs, apply patches, send alerts

## Tech Stack

- **Backend**: FastAPI with mock data endpoints
- **Frontend**: React (via CDN) with responsive CSS
- **Styling**: Custom CSS with cybersecurity dark theme

## Setup & Run

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the server:
```bash
python main.py
```

3. Open browser to `http://localhost:8000`

## Login Credentials

Use any username/password with roles:
- Security Analyst
- Security Auditor  
- Administrator

## Architecture

```
├── main.py              # FastAPI backend with mock endpoints
├── static/
│   ├── index.html       # Main HTML template
│   ├── app.js          # React components and logic
│   └── styles.css      # Cybersecurity-themed CSS
└── requirements.txt     # Python dependencies
```

## API Endpoints

- `POST /api/login` - User authentication
- `GET /api/dashboard/stats` - Dashboard metrics
- `GET /api/vulnerabilities` - Vulnerability data
- `GET /api/scans` - Scan history
- `POST /api/scans` - Create new scan
- `POST /api/upload` - File upload
- `GET /api/chat` - AI assistant queries

## Features Demo

All functionality is mocked for demonstration:
- File uploads generate fake previews
- Scans create mock results
- AI assistant provides sample responses
- Charts and visualizations are placeholders

Perfect for prototyping and showcasing cybersecurity dashboard concepts.