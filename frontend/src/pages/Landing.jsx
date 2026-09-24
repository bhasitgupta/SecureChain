import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, X, Shield, CheckCircle2, Award } from 'lucide-react';
import WalletSelector from '../components/Auth/WalletSelector';
import ThreeBackground from '../components/Common/ThreeBackground';
import ShapeBlur from '../components/ui/ShapeBlur';
import BorderGlow from '../components/ui/BorderGlow';
import { AnimatedBorder } from '../components/ui/button-border';
import ScrollStack, { ScrollStackItem } from '../components/ui/ScrollStack';
import './Landing.css';

export default function Landing() {
  const { isConnected, loading } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCtaClick = () => {
    if (isConnected) {
      navigate('/dashboard');
    } else {
      setModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="lex-landing">
      {/* ── 3D Interactive Three.js Cryptographic Mesh ── */}
      <ThreeBackground opacity={0.7} />
      {/* ── Top Navigation Bar — Translucent Glass ── */}
      <header className="lex-nav">
        <div className="lex-nav-container">
          <div className="lex-nav-brand">
            <img src="/logo-full.png" alt="SecureChain" className="lex-brand-logo-full" />
          </div>

          <button className="lex-nav-cta" onClick={handleCtaClick}>
            {isConnected ? 'Go to Dashboard' : 'Connect Wallet'} <ArrowUpRight size={16} />
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="lex-hero">
        <div className="lex-hero-container">


          <h1 className="lex-hero-title">
            YOUR SOVEREIGN PARTNER IN EVERY TRANSACTION
          </h1>

          <p className="lex-hero-tagline">
            SECURE IDENTITY. CONTROLLED ACCESS. VERIFIABLE ASSET OWNERSHIP.
          </p>

          <div className="lex-hero-btn-wrap">
            <div className="lex-wireframe-polyhedron">
              <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
                <polygon points="100,20 170,70 170,140 100,180 30,140 30,70" stroke="rgba(255, 0, 0, 0.45)" strokeWidth="1.2" strokeDasharray="4 2" />
                <polygon points="100,20 100,180" stroke="rgba(255, 0, 0, 0.35)" strokeWidth="1" />
                <polygon points="30,70 170,140" stroke="rgba(255, 0, 0, 0.3)" strokeWidth="1" />
                <polygon points="170,70 30,140" stroke="rgba(255, 0, 0, 0.3)" strokeWidth="1" />
                <polygon points="65,45 135,45 155,105 100,155 45,105" stroke="rgba(187, 213, 218, 0.65)" strokeWidth="1" />
              </svg>
            </div>
            <button className="lex-hero-btn" onClick={handleCtaClick}>
              {isConnected ? 'Go to Dashboard' : 'Connect Wallet'} <ArrowUpRight size={16} />
            </button>
          </div>

          {/* ── The Whole Second Page Structured As Cinematic ScrollStack Cards ── */}
          <section className="lex-showcase-section">
            <div className="lex-showcase-shapeblur-bg">
              <ShapeBlur
                variation={0}
                pixelRatioProp={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1}
                shapeSize={0.95}
                roundness={0.4}
                borderSize={0.04}
                circleSize={0.45}
                circleEdge={0.8}
              />
            </div>

            <ScrollStack
              className="lex-page-scrollstack"
              itemDistance={100}
              itemScale={0.03}
              itemStackDistance={30}
              stackPosition="14%"
              scaleEndPosition="6%"
              baseScale={0.92}
              scaleDuration={0.5}
              rotationAmount={0}
              blurAmount={1.2}
              useWindowScroll={true}
            >
              {/* ── Stack Card 1: Sovereign Security Foundation & Manifesto ── */}
              <ScrollStackItem itemClassName="lex-stack-item">
                <BorderGlow
                  borderRadius={28}
                  glowRadius={32}
                  glowColor="0 100 50"
                  backgroundColor="linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.94) 100%)"
                  colors={['#FF0000', '#BBD5DA', '#94A3B8']}
                >
                  <div className="lex-page-card">
                    <AnimatedBorder radius={28} size={100} duration={8} />
                    <div className="lex-card-header">
                      <div className="lex-card-tag">
                        <span className="lex-card-tag-dot" />
                        <span>01 / Sovereign Security Foundation</span>
                      </div>
                      <span className="lex-card-badge">Cryptographic Core</span>
                    </div>

                    <div className="lex-card-centerpiece">
                      <div className="lex-card-watermark">SECURITY</div>
                      
                      <div className="lex-card-side-left">
                        <p>
                          Our decentralized framework brings cryptographic proof, zero-knowledge verification, and smart-contract access control to state registries.
                        </p>
                      </div>

                      <div className="lex-card-emblem-wrap">
                        <img src="/logo-icon.png" alt="SecureChain Emblem" className="lex-card-emblem-img" />
                      </div>

                      <div className="lex-card-side-right">
                        <div className="lex-stamp">
                          <span className="lex-stamp-stars">★★★</span>
                          <span className="lex-stamp-text">Sovereign Verified</span>
                        </div>
                        <div className="lex-stamp">
                          <span className="lex-stamp-stars">★★★</span>
                          <span className="lex-stamp-text">Zero-Knowledge</span>
                        </div>
                      </div>
                    </div>

                    <div className="lex-card-manifesto">
                      <p className="lex-card-manifesto-text">
                        At SecureChain, We Deliver Sovereign Blockchain Solutions Through Expertise, Precision, And A <span className="highlight">Security Focused Mindset</span>. Backed By Cryptographic Proof And Immutable Governance, We Protect Every Record Every Step Of The Way.
                      </p>
                    </div>
                  </div>
                </BorderGlow>
              </ScrollStackItem>

              {/* ── Stack Card 2: Enterprise Architecture Pillars ── */}
              <ScrollStackItem itemClassName="lex-stack-item">
                <BorderGlow
                  borderRadius={28}
                  glowRadius={32}
                  glowColor="188 33 80"
                  backgroundColor="linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.94) 100%)"
                  colors={['#BBD5DA', '#FF0000', '#64748B']}
                >
                  <div className="lex-page-card">
                    <AnimatedBorder radius={28} size={100} duration={9} />
                    <div className="lex-card-header">
                      <div className="lex-card-tag">
                        <span className="lex-card-tag-dot" />
                        <span>02 / Enterprise Architecture Framework</span>
                      </div>
                      <span className="lex-card-badge">EVM + Merkle Layer</span>
                    </div>

                    <div className="lex-pillars-grid">
                      <div className="lex-pillar-box">
                        <div className="lex-pillar-num">01 / IDENTITY</div>
                        <h4 className="lex-pillar-title">Zero-Knowledge DID Registry</h4>
                        <p className="lex-pillar-desc">
                          Decentralized sovereign identity verification with W3C compliant DID documents, selective cryptographic disclosure, and non-custodial credentials.
                        </p>
                      </div>

                      <div className="lex-pillar-box">
                        <div className="lex-pillar-num">02 / ACCESS</div>
                        <h4 className="lex-pillar-title">Smart Contract RBAC</h4>
                        <p className="lex-pillar-desc">
                          Hardware-grade role-based access control with granular bitmask permissions, dynamic guardian recovery, and multi-tier state authorization.
                        </p>
                      </div>

                      <div className="lex-pillar-box">
                        <div className="lex-pillar-num">03 / PROOF</div>
                        <h4 className="lex-pillar-title">Immutable Merkle Anchors</h4>
                        <p className="lex-pillar-desc">
                          High-throughput document proof batching anchored on-chain with ECDSA-256 signatures and instant zero-knowledge attestation verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </BorderGlow>
              </ScrollStackItem>

              {/* ── Stack Card 3: Cryptographic State & Network Metrics ── */}
              <ScrollStackItem itemClassName="lex-stack-item">
                <BorderGlow
                  borderRadius={28}
                  glowRadius={32}
                  glowColor="0 100 50"
                  backgroundColor="linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.94) 100%)"
                  colors={['#FF0000', '#CBD5E1', '#0F172A']}
                >
                  <div className="lex-page-card">
                    <AnimatedBorder radius={28} size={100} duration={10} />
                    <div className="lex-card-header">
                      <div className="lex-card-tag">
                        <span className="lex-card-tag-dot" />
                        <span>03 / Immutable State & Ledger Metrics</span>
                      </div>
                      <span className="lex-card-badge">Polygon Proofs</span>
                    </div>

                    <div className="lex-card-metrics-grid">
                      <div className="lex-card-metric-cell">
                        <span className="lex-card-metric-val">100%</span>
                        <span className="lex-card-metric-label">Smart-Contract Enforced</span>
                        <span className="lex-card-metric-sub">Zero Admin Overrides</span>
                      </div>
                      <div className="lex-card-metric-cell">
                        <span className="lex-card-metric-val">0-Sec</span>
                        <span className="lex-card-metric-label">Replay-Protected State</span>
                        <span className="lex-card-metric-sub">Nonce Non-Repudiation</span>
                      </div>
                      <div className="lex-card-metric-cell">
                        <span className="lex-card-metric-val">256-Bit</span>
                        <span className="lex-card-metric-label">ECDSA Cryptography</span>
                        <span className="lex-card-metric-sub">Hardware Key Security</span>
                      </div>
                      <div className="lex-card-metric-cell">
                        <span className="lex-card-metric-val">100%</span>
                        <span className="lex-card-metric-label">Immutable Audit Trail</span>
                        <span className="lex-card-metric-sub">Polygon Mainnet Anchored</span>
                      </div>
                    </div>

                    <div className="lex-card-footer-cta">
                      <span className="lex-card-footer-info">
                        Decentralized control plane independently verifiable across all state registries.
                      </span>
                      <button className="lex-card-footer-btn" onClick={handleCtaClick}>
                        {isConnected ? 'Go to Dashboard' : 'Connect Wallet'} <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                </BorderGlow>
              </ScrollStackItem>
            </ScrollStack>
          </section>
        </div>
      </main>

      {/* ── Wallet Selector Modal ── */}
      {modalOpen && (
        <div className="lex-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="lex-modal-card animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="lex-modal-header">
              <div className="lex-modal-title-wrap">
                <span className="lex-modal-tag">OFFICIAL GATEWAY</span>
                <h3 className="lex-modal-title">Connect Wallet</h3>
              </div>
              <button className="lex-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="lex-modal-body">
              <WalletSelector onSuccess={handleAuthSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
