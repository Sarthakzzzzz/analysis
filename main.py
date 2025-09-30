from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional
import json
import random
from datetime import datetime, timedelta

app = FastAPI(title="ASTRA - Vulnerability Detection System")

# Mock data generators
def generate_vulnerabilities():
    return [
        {"id": f"CVE-2024-{1000+i}", "severity": random.choice(["Critical", "High", "Medium", "Low"]), 
         "score": round(random.uniform(1, 10), 1), "status": random.choice(["Open", "Patched", "Investigating"])}
        for i in range(50)
    ]

def generate_scan_results():
    tools = ["Nmap", "OpenVAS", "Nessus", "Nikto", "Nuclei"]
    return [
        {"id": i, "tool": random.choice(tools), "target": f"192.168.1.{random.randint(1,254)}", 
         "status": random.choice(["Completed", "Running", "Failed"]), 
         "timestamp": (datetime.now() - timedelta(hours=random.randint(1,48))).isoformat()}
        for i in range(20)
    ]

# Models
class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class ScanRequest(BaseModel):
    tool: str
    target: str
    options: Optional[str] = ""

# Routes
@app.post("/api/login")
async def login(request: LoginRequest):
    return {"token": "mock_token", "role": request.role, "user": request.username}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    return {
        "vulnerabilities": {"total": 1247, "critical": 23, "high": 156, "medium": 489, "low": 579},
        "threats": {"active": 12, "mitigated": 45, "investigating": 8},
        "ids_alerts": {"today": 89, "week": 567, "month": 2341},
        "scan_status": {"running": 3, "completed": 156, "failed": 2}
    }

@app.get("/api/vulnerabilities")
async def get_vulnerabilities():
    return generate_vulnerabilities()

@app.get("/api/scans")
async def get_scans():
    return generate_scan_results()

@app.post("/api/scans")
async def create_scan(request: ScanRequest):
    return {"id": random.randint(1000, 9999), "status": "Started", "tool": request.tool, "target": request.target}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    
    # Generate mock preview based on file type
    preview = ""
    if file.filename.endswith('.json'):
        preview = '{"vulnerabilities": [{"cve": "CVE-2024-1234", "severity": "High"}]}'
    elif file.filename.endswith('.xml'):
        preview = '<scan><host>192.168.1.1</host><ports><port>80</port></ports></scan>'
    elif file.filename.endswith('.log'):
        preview = "2024-01-15 10:30:45 [ALERT] Suspicious activity detected\n2024-01-15 10:31:02 [INFO] Scan completed"
    else:
        preview = "Sample text content for preview"
    
    return {
        "filename": file.filename,
        "size": len(content),
        "type": file.content_type,
        "preview": preview,
        "status": "uploaded"
    }

@app.get("/api/chat")
async def chat_query(q: str):
    responses = [
        "Based on the latest vulnerability scans, I found 23 critical CVEs that require immediate attention.",
        "The threat landscape shows increased activity in network reconnaissance. Consider implementing additional monitoring.",
        "Analysis of recent logs indicates potential lateral movement. I recommend isolating affected systems.",
        "Current CVSS scores suggest prioritizing patches for web application vulnerabilities."
    ]
    return {"response": random.choice(responses), "references": ["CVE-2024-1234", "NIST-800-53"]}

# Serve static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)