const { useState, useEffect, useRef } = React;

// Main App Component
function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    const handleLogin = async (credentials) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            setUser(data);
            setCurrentPage('dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    useEffect(() => {
        if (user && currentPage === 'dashboard') {
            fetch('/api/dashboard/stats')
                .then(res => res.json())
                .then(setDashboardData);
        }
    }, [user, currentPage]);

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="app">
            <Header user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="main-content">
                {currentPage === 'dashboard' && <Dashboard data={dashboardData} />}
                {currentPage === 'scanner' && <ScannerControl />}
                {currentPage === 'reports' && <Reports />}
                {currentPage === 'upload' && <FileUpload />}
                {currentPage === 'chat' && <AIAssistant />}
                {currentPage === 'evaluation' && <Evaluation />}
            </main>
        </div>
    );
}

// Login Component
function LoginPage({ onLogin }) {
    const [credentials, setCredentials] = useState({ username: '', password: '', role: 'Analyst' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(credentials);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">ASTRA</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#b0b0b0' }}>
                    Centralized Vulnerability Detection System
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={credentials.username}
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            className="form-select"
                            value={credentials.role}
                            onChange={(e) => setCredentials({...credentials, role: e.target.value})}
                        >
                            <option value="Analyst">Security Analyst</option>
                            <option value="Auditor">Security Auditor</option>
                            <option value="Admin">Administrator</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
}

// Header Component
function Header({ user, currentPage, setCurrentPage }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'scanner', label: 'Scanner' },
        { id: 'reports', label: 'Reports' },
        { id: 'upload', label: 'Upload' },
        { id: 'chat', label: 'AI Assistant' },
        { id: 'evaluation', label: 'Evaluation' }
    ];

    return (
        <header className="header">
            <div className="logo">ASTRA</div>
            <nav className="nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
                <span style={{ color: '#00d4ff', marginLeft: '1rem' }}>
                    {user.role}: {user.user}
                </span>
            </nav>
        </header>
    );
}

// Dashboard Component
function Dashboard({ data }) {
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>Security Dashboard</h1>
            <div className="dashboard-grid">
                <div className="card">
                    <h3 className="card-title">Vulnerabilities</h3>
                    <div className="stat-grid">
                        <div className="stat-item">
                            <div className="stat-value">{data.vulnerabilities.total}</div>
                            <div className="stat-label">Total</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#ff4757' }}>{data.vulnerabilities.critical}</div>
                            <div className="stat-label">Critical</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#ff6b35' }}>{data.vulnerabilities.high}</div>
                            <div className="stat-label">High</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#ffa502' }}>{data.vulnerabilities.medium}</div>
                            <div className="stat-label">Medium</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Active Threats</h3>
                    <div className="stat-grid">
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#ff4757' }}>{data.threats.active}</div>
                            <div className="stat-label">Active</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#00ff88' }}>{data.threats.mitigated}</div>
                            <div className="stat-label">Mitigated</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">IDS Alerts</h3>
                    <div className="stat-grid">
                        <div className="stat-item">
                            <div className="stat-value">{data.ids_alerts.today}</div>
                            <div className="stat-label">Today</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{data.ids_alerts.week}</div>
                            <div className="stat-label">This Week</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Scan Status</h3>
                    <div className="stat-grid">
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#00d4ff' }}>{data.scan_status.running}</div>
                            <div className="stat-label">Running</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value" style={{ color: '#00ff88' }}>{data.scan_status.completed}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="card-title">Threat Heatmap</h3>
                <div style={{ height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#666' }}>Interactive Threat Heatmap Visualization</span>
                </div>
            </div>
        </div>
    );
}

// Scanner Control Component
function ScannerControl() {
    const [scans, setScans] = useState([]);
    const [scanForm, setScanForm] = useState({ tool: 'Nmap', target: '', options: '' });

    useEffect(() => {
        fetch('/api/scans').then(res => res.json()).then(setScans);
    }, []);

    const handleScan = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/scans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scanForm)
            });
            const newScan = await response.json();
            setScans([newScan, ...scans]);
            setScanForm({ tool: 'Nmap', target: '', options: '' });
        } catch (error) {
            console.error('Scan failed:', error);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>Scanner Control</h1>
            
            <div className="card">
                <h3 className="card-title">Configure New Scan</h3>
                <form onSubmit={handleScan} className="scanner-form">
                    <select
                        className="form-select"
                        value={scanForm.tool}
                        onChange={(e) => setScanForm({...scanForm, tool: e.target.value})}
                    >
                        <option value="Nmap">Nmap</option>
                        <option value="OpenVAS">OpenVAS</option>
                        <option value="Nessus">Nessus</option>
                        <option value="Nikto">Nikto</option>
                        <option value="Nuclei">Nuclei</option>
                    </select>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Target (IP/Domain)"
                        value={scanForm.target}
                        onChange={(e) => setScanForm({...scanForm, target: e.target.value})}
                        required
                    />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Options"
                        value={scanForm.options}
                        onChange={(e) => setScanForm({...scanForm, options: e.target.value})}
                    />
                    <button type="submit" className="btn-scan">Run Scan</button>
                </form>
            </div>

            <div className="card">
                <h3 className="card-title">Recent Scans</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Tool</th>
                            <th>Target</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scans.slice(0, 10).map(scan => (
                            <tr key={scan.id}>
                                <td>{scan.tool}</td>
                                <td>{scan.target}</td>
                                <td>
                                    <span className={`severity-badge severity-${scan.status.toLowerCase()}`}>
                                        {scan.status}
                                    </span>
                                </td>
                                <td>{new Date(scan.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Reports Component
function Reports() {
    const [vulnerabilities, setVulnerabilities] = useState([]);

    useEffect(() => {
        fetch('/api/vulnerabilities').then(res => res.json()).then(setVulnerabilities);
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>Reports & Knowledge Base</h1>
            
            <div className="card">
                <h3 className="card-title">Vulnerability Reports</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>CVE ID</th>
                            <th>CVSS Score</th>
                            <th>Severity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vulnerabilities.slice(0, 15).map(vuln => (
                            <tr key={vuln.id}>
                                <td>{vuln.id}</td>
                                <td>{vuln.score}</td>
                                <td>
                                    <span className={`severity-badge severity-${vuln.severity.toLowerCase()}`}>
                                        {vuln.severity}
                                    </span>
                                </td>
                                <td>{vuln.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3 className="card-title">Attack Path Visualization</h3>
                <div style={{ height: '300px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#666' }}>Interactive Attack Path Graph</span>
                </div>
            </div>
        </div>
    );
}

// File Upload Component
function FileUpload() {
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const handleFileUpload = async (fileList) => {
        for (let file of fileList) {
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                setFiles(prev => [...prev, result]);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleFileInput = (e) => {
        handleFileUpload(e.target.files);
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>File Upload & Preview</h1>
            
            <div
                className={`upload-area ${dragOver ? 'dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <h3>Drop files here or click to browse</h3>
                <p>Supported: .json, .xml, .log, .txt</p>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept=".json,.xml,.log,.txt"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                />
            </div>

            <div className="file-grid">
                {files.map((file, index) => (
                    <div key={index} className="file-card">
                        <h4>{file.filename}</h4>
                        <p>Size: {(file.size / 1024).toFixed(1)} KB</p>
                        <p>Type: {file.type}</p>
                        <div className="file-preview">
                            <pre>{file.preview}</pre>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button className="btn-action btn-patch">Send to KB</button>
                            <button 
                                className="btn-action btn-block"
                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// AI Assistant Component
function AIAssistant() {
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I\'m your AI security assistant. Ask me about vulnerabilities, threats, or security analysis.' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        
        try {
            const response = await fetch(`/api/chat?q=${encodeURIComponent(input)}`);
            const data = await response.json();
            const botMessage = { 
                type: 'bot', 
                text: data.response,
                references: data.references 
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat failed:', error);
        }
        
        setInput('');
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>AI Security Assistant</h1>
            
            <div className="card">
                <div className="chat-container">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <p>{msg.text}</p>
                                {msg.references && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#00d4ff' }}>
                                        References: {msg.references.join(', ')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ask about security threats, vulnerabilities..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="btn-primary" onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Evaluation Component
function Evaluation() {
    const metrics = {
        accuracy: 94.2,
        f1Score: 91.8,
        bleuScore: 87.5,
        precision: 93.1,
        recall: 90.6
    };

    const handleAction = (action, target) => {
        alert(`Action: ${action} on ${target}`);
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#00d4ff' }}>Evaluation & Actions</h1>
            
            <div className="dashboard-grid">
                <div className="card">
                    <h3 className="card-title">Performance Metrics</h3>
                    <div className="stat-grid">
                        <div className="stat-item">
                            <div className="stat-value">{metrics.accuracy}%</div>
                            <div className="stat-label">Accuracy</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{metrics.f1Score}%</div>
                            <div className="stat-label">F1 Score</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{metrics.bleuScore}%</div>
                            <div className="stat-label">BLEU Score</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{metrics.precision}%</div>
                            <div className="stat-label">Precision</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Quick Actions</h3>
                    <div className="action-buttons">
                        <button 
                            className="btn-action btn-block"
                            onClick={() => handleAction('Block IP', '192.168.1.100')}
                        >
                            Block IP
                        </button>
                        <button 
                            className="btn-action btn-patch"
                            onClick={() => handleAction('Apply Patch', 'CVE-2024-1234')}
                        >
                            Apply Patch
                        </button>
                        <button 
                            className="btn-action btn-alert"
                            onClick={() => handleAction('Send Alert', 'Security Team')}
                        >
                            Send Alert
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="card-title">System Health</h3>
                <div style={{ height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#666' }}>Real-time System Monitoring Dashboard</span>
                </div>
            </div>
        </div>
    );
}

// Render App
ReactDOM.render(<App />, document.getElementById('root'));