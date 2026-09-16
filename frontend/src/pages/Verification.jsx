import { useState } from 'react';
import { verifyDocumentVersion } from '../lib/api';
import { ShieldCheck, FileSearch, Hash, GitBranch, Blocks, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import './Verification.css';

const STEPS = [
  { id: 'fetch', label: 'Fetch MinIO Object', icon: FileSearch, desc: 'Retrieve exact object version from secure storage' },
  { id: 'sha256', label: 'Compute SHA-256', icon: Hash, desc: 'Hash the exact retrieved bytes' },
  { id: 'merkle', label: 'Merkle Inclusion', icon: GitBranch, desc: 'Verify hash is included in the Merkle tree' },
  { id: 'polygon', label: 'Polygon Anchor', icon: Blocks, desc: 'Compare reconstructed root with on-chain anchor' },
];

export default function Verification() {
  const [versionId, setVersionId] = useState('V1');
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const runVerification = async () => {
    if (!versionId.trim()) return;
    setRunning(true);
    setResult(null);
    setDetails(null);
    setErrorMessage('');
    setCurrentStep(0);

    try {
      // Step through animation visually
      const timer1 = setTimeout(() => setCurrentStep(1), 500);
      const timer2 = setTimeout(() => setCurrentStep(2), 1000);
      const timer3 = setTimeout(() => setCurrentStep(3), 1500);

      const res = await verifyDocumentVersion(versionId.trim());
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      setCurrentStep(4);
      if (res.valid) {
        setResult('VALID');
        setDetails(res.details || res);
      } else {
        setResult('INVALID');
        setErrorMessage(res.details?.failureReason || 'Cryptographic verification check failed');
        setDetails(res.details || res);
      }
    } catch (err) {
      setCurrentStep(4);
      setResult('ERROR');
      setErrorMessage(err.message || 'Verification service unreachable — ensure gateway is running');
      setDetails({
        note: 'Gateway connection failed. Start the backend with: npm run dev:backend',
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Verification Center</h1>
        <p>Independent 4-step cryptographic document verification against Polygon Amoy</p>
      </div>

      <div className="grid-2">
        {/* Input */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Verify Document Version</h3>
          <div className="flex flex-col gap-md">
            <div className="input-group">
              <label>Version ID or Document UUID</label>
              <input 
                className="input font-mono" 
                placeholder="e.g. V1 or UUID"
                value={versionId} 
                onChange={e => setVersionId(e.target.value)} 
              />
            </div>
            
            <button 
              className="btn btn-primary btn-lg w-full" 
              onClick={runVerification} 
              disabled={running}
            >
              {running ? <><Loader2 size={16} className="spin" /> Cryptographic Checking...</> : <><ShieldCheck size={18} /> Run Verification</>}
            </button>
          </div>

          {result && (
            <div className={`verify-result verify-result-${result.toLowerCase()}`} style={{ marginTop: 'var(--space-lg)' }}>
              {result === 'VALID' ? <CheckCircle size={28} /> : result === 'ERROR' ? <AlertCircle size={28} /> : <XCircle size={28} />}
              <div>
                <div className="verify-result-title">{result}</div>
                <div className="verify-result-desc">
                  {result === 'VALID' 
                    ? 'Document integrity fully certified: SHA-256 matches bytes, Merkle inclusion proof verified, Polygon anchor confirmed.' 
                    : `Verification failed: ${errorMessage || 'Document altered or not anchored.'}`}
                </div>
                {details && (
                  <div className="text-xs font-mono mt-2" style={{ marginTop: '8px' }}>
                    {details.computedSha256 && <div style={{ fontWeight: 600 }}>SHA-256: {details.computedSha256.slice(0, 24)}...</div>}
                    {details.note && <div style={{ marginTop: '4px', fontWeight: 500 }}>{details.note}</div>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pipeline */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Verification Pipeline</h3>
          <div className="verify-pipeline">
            {STEPS.map((s, i) => {
              const isDone = currentStep > i;
              const isCurrent = currentStep === i;
              return (
                <div key={s.id} className={`verify-pipeline-item ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''}`}>
                  <div className="verify-item-icon">
                    <s.icon size={18} />
                  </div>
                  <div className="verify-item-content">
                    <div className="verify-item-label">{s.label}</div>
                    <div className="verify-item-desc">{s.desc}</div>
                  </div>
                  {isDone && <CheckCircle size={16} className="text-success" />}
                  {isCurrent && <Loader2 size={16} className="spin text-primary" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
