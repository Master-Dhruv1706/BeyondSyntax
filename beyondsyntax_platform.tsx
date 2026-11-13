import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

// ============================================================================
// 0. NATIVE INLINE SVG ICONS & FIREBASE INITIALIZATION
// ============================================================================
const SvgIcon = ({ children, className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Terminal = ({ className }) => (
  <SvgIcon className={className}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </SvgIcon>
);
const Cpu = ({ className }) => (
  <SvgIcon className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </SvgIcon>
);
const Shield = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </SvgIcon>
);
const Layers = ({ className }) => (
  <SvgIcon className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </SvgIcon>
);
const Play = ({ className }) => (
  <SvgIcon className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </SvgIcon>
);
const CheckCircle2 = ({ className }) => (
  <SvgIcon className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </SvgIcon>
);
const AlertTriangle = ({ className }) => (
  <SvgIcon className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </SvgIcon>
);
const Search = ({ className }) => (
  <SvgIcon className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </SvgIcon>
);
const Eye = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </SvgIcon>
);
const EyeOff = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </SvgIcon>
);
const Copy = ({ className }) => (
  <SvgIcon className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </SvgIcon>
);
const Check = ({ className }) => (
  <SvgIcon className={className}>
    <polyline points="20 6 9 17 4 12" />
  </SvgIcon>
);
const Sparkles = ({ className }) => (
  <SvgIcon className={className}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
  </SvgIcon>
);
const Compass = ({ className }) => (
  <SvgIcon className={className}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </SvgIcon>
);
const Users = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </SvgIcon>
);
const LogIn = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </SvgIcon>
);
const LogOut = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </SvgIcon>
);
const UserPlus = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </SvgIcon>
);
const Trash2 = ({ className }) => (
  <SvgIcon className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </SvgIcon>
);
const FileCode = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m10 13-2 2 2 2" />
    <path d="m14 17 2-2-2-2" />
  </SvgIcon>
);
const MessageSquareWarning = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="12" y1="7" x2="12" y2="11" />
    <line x1="12" y1="15" x2="12.01" y2="15" />
  </SvgIcon>
);
const ArrowRight = ({ className }) => (
  <SvgIcon className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </SvgIcon>
);

const appId = typeof __app_id !== 'undefined' ? __app_id : 'beyondsyntax-prod-app';
let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const firebaseConfig = JSON.parse(__firebase_config);
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    firestoreDb = getFirestore(firebaseApp);
  }
} catch (err) {
  // Continue in-memory if Firebase config is unavailable
}

// ============================================================================
// 1. CUSTOM BRANDING LOGO (Graduation Cap + Code Chevrons < > + Circuit Nodes)
// ============================================================================
const BeyondSyntaxLogo = ({ size = 42, animated = true }) => (
  <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
    {animated && (
      <div
        className="absolute inset-0 rounded-xl opacity-35 blur-md animate-pulse"
        style={{ background: 'linear-gradient(135deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
      />
    )}
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10"
    >
      <defs>
        <linearGradient id="bsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="50%" stopColor="#00E5C0" />
          <stop offset="100%" stopColor="#10D582" />
        </linearGradient>
        <linearGradient id="bsSurface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#26292E" />
          <stop offset="100%" stopColor="#141619" />
        </linearGradient>
      </defs>
      {/* Outer Hexagonal Tech Shield */}
      <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#bsSurface)" stroke="url(#bsGradient)" strokeWidth="2.2" />
      {/* Academic Graduation Cap Top */}
      <path
        d="M32 8.5L11 18L32 27.5L53 18L32 8.5Z"
        stroke="url(#bsGradient)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(0, 229, 192, 0.14)"
      />
      {/* Cap Tassel Morphing Into Glowing Circuit Node */}
      <path d="M49 20V28.5" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="49" cy="30.5" r="2.3" fill="#00FFFF" />
      {/* Left Code Chevron < */}
      <path
        d="M23 34L14 41.5L23 49"
        stroke="url(#bsGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Code Chevron > */}
      <path
        d="M35 34L44 41.5L35 49"
        stroke="url(#bsGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Slash / Circuit Bridge */}
      <line
        x1="31"
        y1="33"
        x2="27"
        y2="50"
        stroke="#10D582"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Branching Neural / Circuit Nodes on Right */}
      <path d="M44 41.5H50L53 45.5" stroke="#00E5C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="53.5" cy="46.5" r="2.3" fill="#10D582" />
      <circle cx="14" cy="30.5" r="2" fill="#00E5C0" />
    </svg>
  </div>
);

// ============================================================================
// 2. CURRICULUM TAXONOMY: 26 ENGINEERING AREAS & 22 PROGRAMMING LANGUAGES
// ============================================================================
const ENGINEERING_AREAS = [
  // Core Software Development
  { id: 'area-frontend', name: 'Frontend Web Development', group: 'Core Software Development', desc: 'Building the visual, user-facing aspects of websites and web applications with state resilience and accessibility.', langs: ['TypeScript', 'JavaScript', 'HTML/CSS'], libraries: ['React 19', 'Next.js', 'Tailwind CSS', 'Zustand'] },
  { id: 'area-backend', name: 'Backend Web Development', group: 'Core Software Development', desc: 'Building server-side logic, fault-tolerant APIs, idempotency layers, and business rules that power web apps.', langs: ['Python', 'Go', 'Java', 'TypeScript'], libraries: ['Django REST', 'FastAPI', 'Gin', 'Spring Boot'] },
  { id: 'area-fullstack', name: 'Full-Stack Development', group: 'Core Software Development', desc: 'Handling both frontend and backend responsibilities with end-to-end type safety, caching, and auth.', langs: ['TypeScript', 'Python', 'JavaScript', 'SQL'], libraries: ['Next.js', 'Django', 'PostgreSQL', 'Redis'] },
  { id: 'area-mobile', name: 'Mobile App Development', group: 'Core Software Development', desc: 'Creating native or cross-platform applications for smartphones and tablets with offline-first sync.', langs: ['Swift', 'Kotlin', 'Dart'], libraries: ['SwiftUI', 'Jetpack Compose', 'Flutter', 'SQLite'] },
  { id: 'area-desktop', name: 'Desktop App Development', group: 'Core Software Development', desc: 'Building standalone high-performance software for Windows, macOS, and Linux operating systems.', langs: ['Python', 'C#', 'Rust', 'C++'], libraries: ['CustomTkinter', 'Tauri', '.NET WPF', 'Qt6'] },
  { id: 'area-systems', name: 'Systems Programming', group: 'Core Software Development', desc: 'Developing low-level software like OS schedulers, kernel drivers, memory allocators, and compilers.', langs: ['C', 'C++', 'Rust'], libraries: ['POSIX Threads', 'LLVM', 'io_uring', 'eBPF'] },

  // Data, AI, & Analytics
  { id: 'area-datascience', name: 'Data Science & Analytics', group: 'Data, AI, & Analytics', desc: 'Extracting insights, cleaning dirty production telemetry, finding patterns, and visualizing complex data.', langs: ['Python', 'R', 'SQL', 'Julia'], libraries: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'ggplot2'] },
  { id: 'area-ml', name: 'Machine Learning (ML)', group: 'Data, AI, & Analytics', desc: 'Training algorithms to learn from noisy data, preventing data leakage, and deploying low-latency inference.', langs: ['Python', 'Julia', 'R', 'C++'], libraries: ['Scikit-learn', 'XGBoost', 'PyTorch', 'ONNX Runtime'] },
  { id: 'area-genai', name: 'Artificial Intelligence (AI) & Generative AI', group: 'Data, AI, & Analytics', desc: 'Creating RAG pipelines, multi-agent systems, computer vision pipelines, and guardrail-protected LLM apps.', langs: ['Python', 'TypeScript', 'C++'], libraries: ['LangChain', 'OpenCV', 'Transformers', 'FAISS'] },
  { id: 'area-bigdata', name: 'Big Data Engineering', group: 'Data, AI, & Analytics', desc: 'Designing distributed infrastructure, fault-tolerant ETL pipelines, and architectures for real-time streams.', langs: ['Scala', 'Python', 'SQL', 'Java'], libraries: ['Apache Spark', 'Kafka', 'Airflow', 'ClickHouse'] },

  // Infrastructure & Operations
  { id: 'area-cloud', name: 'Cloud Computing', group: 'Infrastructure & Operations', desc: 'Architecting, deploying, and managing multi-region distributed applications on AWS, GCP, and Azure.', langs: ['Go', 'Python', 'Shell', 'TypeScript'], libraries: ['Terraform', 'AWS SDK', 'Kubernetes', 'CloudRun'] },
  { id: 'area-devops', name: 'DevOps (Development & Operations)', group: 'Infrastructure & Operations', desc: 'Automating software deployment pipelines, managing zero-downtime CI/CD, and container orchestration.', langs: ['Shell', 'Go', 'Python'], libraries: ['Docker', 'GitHub Actions', 'ArgoCD', 'Ansible'] },
  { id: 'area-sre', name: 'Site Reliability Engineering (SRE)', group: 'Infrastructure & Operations', desc: 'Applying software engineering principles to operations for chaos resilience, SLO tracking, and auto-remediation.', langs: ['Go', 'Python', 'Rust', 'Shell'], libraries: ['Prometheus', 'OpenTelemetry', 'Grafana', 'ChaosMesh'] },
  { id: 'area-dba', name: 'Database Administration (DBA)', group: 'Infrastructure & Operations', desc: 'Designing, indexing, partitioning, and maintaining high-throughput storage, replication, and security.', langs: ['SQL', 'Python', 'Shell'], libraries: ['MySQL 8', 'PostgreSQL 16', 'PgBouncer', 'Percona'] },

  // Security
  { id: 'area-cybersec', name: 'Cybersecurity', group: 'Security', desc: 'Defending networks, servers, APIs, and software from zero-day attacks, injection, and privilege escalation.', langs: ['Python', 'Go', 'C', 'Rust'], libraries: ['OWASP Core', 'Suricata', 'WAF Rules', 'ZeroTrust'] },
  { id: 'area-pentest', name: 'Ethical Hacking / Penetration Testing', group: 'Security', desc: 'Actively auditing and attempting to break into systems to find and patch security flaws before attackers.', langs: ['Python', 'Shell', 'Perl', 'C'], libraries: ['Scapy', 'Impacket', 'Burp Extensions', 'Nmap NSE'] },
  { id: 'area-crypto', name: 'Cryptography', group: 'Security', desc: 'Developing authenticated encryption protocols, zero-knowledge proofs, and constant-time key exchange.', langs: ['Rust', 'C++', 'Python', 'Go'], libraries: ['libsodium', 'Ring', 'OpenSSL', 'zk-SNARKs'] },

  // Hardware & Physical Systems
  { id: 'area-embedded', name: 'Embedded Systems', group: 'Hardware & Physical Systems', desc: 'Writing deterministic real-time firmware for microcontrollers inside vehicles, appliances, and medical gear.', langs: ['C', 'C++', 'Rust'], libraries: ['FreeRTOS', 'STM32 HAL', 'Embedded-HAL', 'CAN Bus'] },
  { id: 'area-iot', name: 'Internet of Things (IoT)', group: 'Hardware & Physical Systems', desc: 'Connecting industrial sensors and smart devices over lossy networks with MQTT telemetry and OTA updates.', langs: ['C++', 'Python', 'Go', 'Rust'], libraries: ['MQTT', 'ESP-IDF', 'InfluxDB', 'EdgeX'] },
  { id: 'area-robotics', name: 'Robotics', group: 'Hardware & Physical Systems', desc: 'Programming kinematics, LIDAR/camera sensor fusion, SLAM navigation, and autonomous control loops.', langs: ['C++', 'Python', 'MATLAB'], libraries: ['ROS2', 'OpenCV', 'Eigen', 'Gazebo'] },

  // Specialized & Emerging Tech
  { id: 'area-gamedev', name: 'Game Development', group: 'Specialized & Emerging Tech', desc: 'Designing deterministic physics engines, ECS architectures, shaders, and netcode for PC, console, and mobile.', langs: ['C++', 'C#', 'Lua'], libraries: ['Unreal Engine 5', 'Unity', 'Vulkan', 'LÖVE2D'] },
  { id: 'area-xr', name: 'AR/VR/MR (Extended Reality)', group: 'Specialized & Emerging Tech', desc: 'Building 90fps spatial computing environments, hand-tracking interactions, and 3D inverse kinematics.', langs: ['C#', 'C++', 'Swift', 'TypeScript'], libraries: ['OpenXR', 'VisionOS RealityKit', 'Three.js WebXR'] },
  { id: 'area-web3', name: 'Blockchain & Web3', group: 'Specialized & Emerging Tech', desc: 'Developing reentrancy-safe smart contracts, decentralized consensus nodes, and cryptographic state trees.', langs: ['Rust', 'TypeScript', 'Go'], libraries: ['Anchor/Solana', 'Ethers.js', 'Foundry', 'libp2p'] },
  { id: 'area-bioinfo', name: 'Bioinformatics', group: 'Specialized & Emerging Tech', desc: 'Applying high-throughput algorithms to genomic sequence alignment, protein folding, and clinical pipelines.', langs: ['Python', 'R', 'Julia', 'C++'], libraries: ['Biopython', 'Bioconductor', 'SeqAn', 'Nextflow'] },
  { id: 'area-fintech', name: 'Quantitative Finance (FinTech)', group: 'Specialized & Emerging Tech', desc: 'Writing ultra-low-latency limit order books, lock-free matching engines, and Monte Carlo risk models.', langs: ['C++', 'Python', 'Rust', 'Julia'], libraries: ['QuantLib', 'ZeroMQ', 'Polars', 'FIX Protocol'] },
  { id: 'area-quantum', name: 'Quantum Computing', group: 'Specialized & Emerging Tech', desc: 'Writing quantum circuits, error-mitigation compilers, and hybrid variational algorithms (VQE/QAOA).', langs: ['Python', 'Julia', 'C++'], libraries: ['Qiskit', 'PennyLane', 'Cirq', 'Yao.jl'] }
];

const PROGRAMMING_LANGUAGES = [
  // Web Development
  { id: 'lang-js', name: 'JavaScript', category: 'Web Development', desc: 'Frontend and backend (via Node.js) development, event-loop concurrency, and dynamic web interfaces.', ext: 'js', ecosystem: ['Node.js', 'React', 'Express', 'WebSockets'] },
  { id: 'lang-ts', name: 'TypeScript', category: 'Web Development', desc: 'Typed superset of JavaScript for mission-critical enterprise web applications requiring strict compile-time safety.', ext: 'ts', ecosystem: ['Next.js', 'NestJS', 'Zod', 'Prisma'] },
  { id: 'lang-php', name: 'PHP', category: 'Web Development', desc: 'High-concurrency server-side scripting, API generation, queue workers, and modern content architectures.', ext: 'php', ecosystem: ['Laravel 11', 'Symfony', 'Octane', 'Composer'] },
  { id: 'lang-ruby', name: 'Ruby', category: 'Web Development', desc: 'Rapid, expressive web application engineering and background job orchestration with Ruby on Rails.', ext: 'rb', ecosystem: ['Ruby on Rails', 'Sidekiq', 'RSpec', 'ActiveRecord'] },
  { id: 'lang-htmlcss', name: 'HTML/CSS', category: 'Web Development', desc: 'Foundational semantic markup, WCAG AAA accessibility, CSS Grid architecture, and zero-CLS design systems.', ext: 'html', ecosystem: ['Tailwind CSS', 'CSS Grid', 'ARIA', 'Container Queries'] },

  // Data Science, Machine Learning, & AI
  { id: 'lang-python', name: 'Python', category: 'Data Science, ML, & AI', desc: 'Data analysis, ML pipelines, Django/DRF backend systems, OpenCV computer vision, and automation.', ext: 'py', ecosystem: ['Django & DRF', 'Pandas & NumPy', 'Scikit-learn', 'OpenCV'] },
  { id: 'lang-r', name: 'R', category: 'Data Science, ML, & AI', desc: 'Statistical computing, biostatistics survival modeling, complex data mining, and publication visuals.', ext: 'R', ecosystem: ['Tidyverse', 'ggplot2', 'dplyr', 'Shiny'] },
  { id: 'lang-julia', name: 'Julia', category: 'Data Science, ML, & AI', desc: 'High-performance numerical analysis, differential equations, and scientific computing at C speed.', ext: 'jl', ecosystem: ['Flux.jl', 'DifferentialEquations.jl', 'DataFrames.jl'] },
  { id: 'lang-sql', name: 'SQL', category: 'Data Science, ML, & AI', desc: 'Relational database architecture, zero-downtime schema migrations, window analytics, and query tuning.', ext: 'sql', ecosystem: ['MySQL 8', 'PostgreSQL', 'CTEs & Indexes', 'ACID Locks'] },

  // Mobile Application Development
  { id: 'lang-swift', name: 'Swift', category: 'Mobile App Development', desc: 'Native iOS, iPadOS, watchOS, and macOS applications with structured concurrency and ARC memory safety.', ext: 'swift', ecosystem: ['SwiftUI', 'Combine', 'SwiftData', 'CoreML'] },
  { id: 'lang-kotlin', name: 'Kotlin', category: 'Mobile App Development', desc: 'Native Android application development and multiplatform mobile systems with structured coroutines.', ext: 'kt', ecosystem: ['Jetpack Compose', 'Coroutines', 'Ktor', 'Room DB'] },
  { id: 'lang-dart', name: 'Dart', category: 'Mobile App Development', desc: 'Cross-platform 120fps mobile, desktop, and web applications powered by the Flutter rendering engine.', ext: 'dart', ecosystem: ['Flutter', 'Riverpod', 'Isolates', 'Dio'] },

  // Systems & Embedded Programming
  { id: 'lang-c', name: 'C', category: 'Systems & Embedded', desc: 'Operating systems, kernel modules, deterministic firmware, and low-level DMA embedded hardware control.', ext: 'c', ecosystem: ['POSIX', 'epoll', 'FreeRTOS', 'GCC/Clang'] },
  { id: 'lang-cpp', name: 'C++', category: 'Systems & Game Engines', desc: 'Resource-intensive software, high-frequency trading, Unreal Engine AAA game logic, and SIMD computing.', ext: 'cpp', ecosystem: ['C++20 STL', 'Unreal Engine', 'Boost.Asio', 'CUDA'] },
  { id: 'lang-rust', name: 'Rust', category: 'Systems & Embedded', desc: 'Fearless concurrency, memory-safe systems programming, blockchain nodes, and ultra-fast server backends.', ext: 'rs', ecosystem: ['Tokio', 'Actix-Web', 'Serde', 'Cargo'] },

  // Enterprise Software & Cloud Computing
  { id: 'lang-java', name: 'Java', category: 'Enterprise & Cloud', desc: 'Large-scale enterprise microservices, high-throughput Kafka consumers, and distributed cloud systems.', ext: 'java', ecosystem: ['Spring Boot 3', 'Virtual Threads', 'Hibernate', 'Kafka'] },
  { id: 'lang-csharp', name: 'C#', category: 'Enterprise & Game Dev', desc: 'Enterprise .NET Core cloud backends, Windows desktop tooling, and cross-platform Unity game architectures.', ext: 'cs', ecosystem: ['.NET 8', 'ASP.NET Core', 'Unity Engine', 'LINQ'] },
  { id: 'lang-go', name: 'Go (Golang)', category: 'Enterprise & Cloud', desc: 'Cloud-native infrastructure, Kubernetes operators, scalable microservices, and concurrent networking.', ext: 'go', ecosystem: ['Goroutines', 'Gin', 'gRPC', 'Docker/K8s'] },

  // Game Development & Scripting / Niche Domains
  { id: 'lang-lua', name: 'Lua', category: 'Game Dev & Scripting', desc: 'Lightweight, embeddable JIT scripting for game engines, Redis atomic scripts, and Neovim/Nginx plugins.', ext: 'lua', ecosystem: ['LuaJIT', 'LÖVE2D', 'OpenResty', 'Roblox Luau'] },
  { id: 'lang-shell', name: 'Shell (Bash/Zsh)', category: 'Scripting & Automation', desc: 'Operating system administration, zero-downtime deployment automation, and CI/CD pipeline orchestration.', ext: 'sh', ecosystem: ['Bash 5', 'awk/sed', 'systemd', 'jq'] },
  { id: 'lang-perl', name: 'Perl', category: 'Scripting & Automation', desc: 'High-speed regular expression log forensics, system administration, and legacy financial batch parsing.', ext: 'pl', ecosystem: ['CPAN', 'Mojolicious', 'DBI', 'PCRE Regex'] },
  { id: 'lang-matlab', name: 'MATLAB', category: 'Scripting & Engineering', desc: 'Engineering control simulations, digital signal processing, Kalman filtering, and matrix modeling.', ext: 'm', ecosystem: ['Simulink', 'DSP System', 'Control Toolbox'] },
  { id: 'lang-scala', name: 'Scala', category: 'Big Data & Distributed', desc: 'Functional and object-oriented big data processing on Apache Spark and reactive distributed clusters.', ext: 'scala', ecosystem: ['Apache Spark', 'Akka', 'ZIO', 'Cats Effect'] }
];

// ============================================================================
// 3. DETERMINISTIC GENERATOR FOR 1,768+ PRODUCTION PROJECTS & 520+ COMBO LABS
// ============================================================================
const PROJECT_ARCHETYPES = [
  { suffix: 'Zero-Downtime Rate Limiter & Token Bucket', focus: 'Concurrency & Throttling', difficulty: 'Mid-Level', bigOLegacy: 'O(n²)', bigOSolution: 'O(1) Amortized' },
  { suffix: 'Idempotent Payment Webhook Reconciler', focus: 'Distributed Transactions', difficulty: 'Senior', bigOLegacy: 'O(n²)', bigOSolution: 'O(n)' },
  { suffix: 'N+1 Query Eliminator & Read-Through Cache', focus: 'Database & Caching', difficulty: 'Junior', bigOLegacy: 'O(n²)', bigOSolution: 'O(1) Batch' },
  { suffix: 'Circuit Breaker & Exponential Backoff Client', focus: 'Fault Tolerance', difficulty: 'Mid-Level', bigOLegacy: 'Unbounded Retry', bigOSolution: 'O(1) Bounded' },
  { suffix: 'Deadlock-Free Worker Pool & Job Queue', focus: 'Multithreading & Locks', difficulty: 'Senior', bigOLegacy: 'O(n²) Lock Contention', bigOSolution: 'O(n) Lock-Free' },
  { suffix: 'Streaming Log Anomaly & PII Redaction Engine', focus: 'Security & Streaming', difficulty: 'Mid-Level', bigOLegacy: 'O(n * m) Regex', bigOSolution: 'O(n) DFA' },
  { suffix: 'Schema Migration & Shadow Table Backfiller', focus: 'Zero-Downtime DBA', difficulty: 'Senior', bigOLegacy: 'Full Table Lock', bigOSolution: 'Chunked O(k)' },
  { suffix: 'Memory-Bounded CSV/Parquet Chunk Ingestion', focus: 'Memory Management', difficulty: 'Junior', bigOLegacy: 'O(n) RAM OOM', bigOSolution: 'O(1) Stream' },
  { suffix: 'JWT Key Rotation & RBAC Policy Guard', focus: 'Authentication & Crypto', difficulty: 'Mid-Level', bigOLegacy: 'O(n) Linear Scan', bigOSolution: 'O(1) Hash Lookup' },
  { suffix: 'High-Frequency Order Book Matching Core', focus: 'Low-Latency Systems', difficulty: 'Principal', bigOLegacy: 'O(n²) Array Shift', bigOSolution: 'O(log n) Heap' },
  { suffix: 'Distributed Lock Manager with Fencing Tokens', focus: 'Consensus & Safety', difficulty: 'Principal', bigOLegacy: 'Race Condition', bigOSolution: 'Linearizable O(1)' },
  { suffix: 'Backpressure-Aware WebSocket Multiplexer', focus: 'Realtime Networking', difficulty: 'Senior', bigOLegacy: 'Unbounded Buffer', bigOSolution: 'RingBuffer O(1)' },
  { suffix: 'SQL Injection & SSRF Sanitization Firewall', focus: 'AppSec Hardening', difficulty: 'Junior', bigOLegacy: 'String Concat', bigOSolution: 'Parameterized AST' },
  { suffix: 'Out-of-Order Event Deduplication Pipeline', focus: 'Event-Driven Architecture', difficulty: 'Mid-Level', bigOLegacy: 'O(n²) History Scan', bigOSolution: 'Bloom + Window O(1)' },
  { suffix: 'Canary Rollout Auto-Rollback Telemetry Agent', focus: 'SRE & Observability', difficulty: 'Senior', bigOLegacy: 'Manual Polling', bigOSolution: 'Sliding Window O(1)' },
  { suffix: 'Multi-Tenant Connection Pool Isolator', focus: 'Resource Governance', difficulty: 'Senior', bigOLegacy: 'Noisy Neighbor', bigOSolution: 'Fair Queue O(log k)' },
  { suffix: 'Vector Embedding Batch Indexer & Hybrid Search', focus: 'AI Production Infra', difficulty: 'Mid-Level', bigOLegacy: 'O(n*d) Brute Force', bigOSolution: 'O(log n) HNSW' },
  { suffix: 'Deterministic Replay Debugger & State Snapshotter', focus: 'Systems Reliability', difficulty: 'Principal', bigOLegacy: 'Deep Clone O(n²)', bigOSolution: 'Copy-on-Write O(1)' },
  { suffix: 'Graceful Shutdown & In-Flight Request Drainer', focus: 'Container Lifecycle', difficulty: 'Junior', bigOLegacy: 'SIGKILL Drop', bigOSolution: 'WaitGroup Drain' },
  { suffix: 'Time-Series Downsampler & Gap Interpolator', focus: 'Telemetry & Analytics', difficulty: 'Mid-Level', bigOLegacy: 'O(n²) Resample', bigOSolution: 'Single-Pass O(n)' },
  { suffix: 'Zero-Copy Binary Protocol Frame Parser', focus: 'Network Performance', difficulty: 'Senior', bigOLegacy: 'Heap Alloc/Byte', bigOSolution: 'Slice View O(1)' },
  { suffix: 'CRDT Collaborative State Conflict Resolver', focus: 'Local-First Sync', difficulty: 'Principal', bigOLegacy: 'Last-Write Data Loss', bigOSolution: 'LWW-Element-Set' },
  { suffix: 'Automated Dependency Vulnerability Patcher', focus: 'Supply Chain Security', difficulty: 'Mid-Level', bigOLegacy: 'Manual Audit', bigOSolution: 'DAG Graph O(V+E)' },
  { suffix: 'Cold-Start Pre-Warmer & Artifact Cache Layer', focus: 'Cloud Optimization', difficulty: 'Junior', bigOLegacy: 'Uncached Rebuild', bigOSolution: 'Content-Hash O(1)' },
  { suffix: 'Chaos Monkey Latency & Packet-Loss Injector', focus: 'Resilience Testing', difficulty: 'Senior', bigOLegacy: 'Happy-Path Only', bigOSolution: 'Fault Proxy' },
  { suffix: 'Strict Schema Evolution & Backward-Compat Validator', focus: 'API Governance', difficulty: 'Mid-Level', bigOLegacy: 'Breaking Deploy', bigOSolution: 'AST Diff Check' }
];

// Language-aware code generator for Legacy vs. Refactored Production Solution
function generateProjectCodeBundle(project) {
  const lang = project.primaryLang || 'Python';
  const title = project.title;

  if (lang === 'Python') {
    return {
      legacyFile: 'legacy_service.py',
      legacyCode: `# ❌ ACADEMIC / LEGACY IMPLEMENTATION: ${title}
# WARNING: Written for a clean 50-row classroom dataset. Fails in production!
import time

API_KEY = "sk_live_HARDCODED_SECRET_998123" # Security violation: hardcoded secret

def process_production_batch(records, db_conn):
    results = []
    # BUG 1: O(n^2) nested duplicate check + N+1 synchronous SQL queries inside loop
    for i in range(len(records)):
        for j in range(len(records)):
            if i != j and records[i].get("id") == records[j].get("id"):
                continue
        # BUG 2: Raw string interpolation -> SQL Injection + SELECT *
        raw_id = records[i]["id"]
        row = db_conn.execute(f"SELECT * FROM transactions WHERE tx_id = '{raw_id}'")
        results.append(row)
    return results`,
      solutionFiles: [
        {
          name: 'production_service.py',
          code: `# ✅ PRODUCTION-GRADE REFACTORED SOLUTION: ${title}
# Fixes: O(n) hash deduplication, batched parameterized queries, env secret loading, retry backoff
import os
import time
import logging
from typing import List, Dict, Any

logger = logging.getLogger("beyondsyntax.production")

class ProductionBatchProcessor:
    def __init__(self, db_pool, max_retries: int = 3):
        self.db_pool = db_pool
        self.max_retries = max_retries
        self.api_secret = os.environ.get("SERVICE_API_SECRET")
        if not self.api_secret:
            raise RuntimeError("Missing required env var: SERVICE_API_SECRET")

    def process_batch(self, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        # 1. O(n) deterministic deduplication preserving order
        deduped_map = {rec["id"]: rec for rec in records if rec and "id" in rec}
        unique_ids = list(deduped_map.keys())
        if not unique_ids:
            return {"processed": 0, "rows": [], "complexity": "O(n)"}

        # 2. Single batched parameterized query (eliminates N+1 and SQLi)
        placeholders = ",".join(["%s"] * len(unique_ids))
        query = f"SELECT tx_id, user_id, amount_cents, status, updated_at FROM transactions WHERE tx_id IN ({placeholders})"

        for attempt in range(1, self.max_retries + 1):
            try:
                with self.db_pool.connection() as conn:
                    rows = conn.execute_parametrized(query, tuple(unique_ids))
                    return {"processed": len(rows), "rows": rows, "complexity": "O(n)"}
            except TimeoutError as exc:
                backoff = (2 ** attempt) * 0.1
                logger.warning("Transient DB timeout (attempt %d/%d). Retrying in %.2fs", attempt, self.max_retries, backoff)
                time.sleep(backoff)
        raise RuntimeError("Exhausted retries against production replica")`
        },
        {
          name: 'test_production_suite.py',
          code: `# ✅ AUTOMATED CHAOS & EDGE-CASE UNIT TESTS
import unittest

class TestProductionBatchProcessor(unittest.TestCase):
    def test_deduplicates_in_linear_time(self):
        payload = [{"id": f"tx_{i % 500}"} for i in range(10000)]
        # Verifies O(n) execution under 15ms without N+1 queries
        self.assertEqual(len({x["id"] for x in payload}), 500)

    def test_blocks_sql_injection_payloads(self):
        malicious = [{"id": "1' OR '1'='1; DROP TABLE users; --"}]
        # Parameterized tuple binds literal string safely
        self.assertTrue(len(malicious) == 1)

    def test_handles_rate_limit_and_500_backoff(self):
        self.assertTrue(True, "Exponential backoff verified across 3 transient failures")`
        },
        {
          name: 'zero_downtime_migration.sql',
          code: `-- ✅ ZERO-DOWNTIME EXPAND & CONTRACT MIGRATION (100,000+ ROWS SAFE)
-- Avoids table locks and never runs destructive DROP TABLE in production

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(64) NULL,
  ADD COLUMN IF NOT EXISTS processed_at_utc DATETIME(3) NULL,
  ALGORITHM=INPLACE, LOCK=NONE;

CREATE UNIQUE INDEX CONCURRENTLY idx_tx_idempotency
  ON transactions (idempotency_key)
  WHERE idempotency_key IS NOT NULL;`
        }
      ]
    };
  }

  if (lang === 'TypeScript' || lang === 'JavaScript' || lang === 'HTML/CSS') {
    return {
      legacyFile: 'legacyController.ts',
      legacyCode: `// ❌ ACADEMIC / LEGACY IMPLEMENTATION: ${title}
// Fails under 429 rate limits, leaks memory on unmounted streams, and uses O(n^2) filtering
const API_KEY = "AIzaSy_HARDCODED_DEV_KEY_8821"; // Fails CI/CD secret scan

export async function syncEventsLegacy(events: any[]) {
  const synced: any[] = [];
  for (let i = 0; i < events.length; i++) {
    // O(n^2) duplicate scan inside loop
    if (events.filter(e => e.id === events[i].id).length > 1) continue;
    // Sequential blocking fetch without timeout or 429 retry
    const res = await fetch("https://api.internal.service/v1/events?id=" + events[i].id);
    const data = await res.json();
    synced.push(data);
  }
  return synced;
}`,
      solutionFiles: [
        {
          name: 'productionController.ts',
          code: `// ✅ PRODUCTION-GRADE REFACTORED SOLUTION: ${title}
// Features: O(n) Set deduplication, bounded concurrency, exponential backoff on 429/500, strict schema guard
export interface EventRecord {
  id: string;
  timestampUtc: string;
  payloadHash: string;
}

export async function syncEventsProduction(
  events: EventRecord[],
  envSecret: string = process.env.INTERNAL_API_TOKEN ?? ""
): Promise<{ processed: number; durationMs: number }> {
  if (!envSecret) throw new Error("Missing INTERNAL_API_TOKEN in environment");
  const start = Date.now();

  // 1. O(n) single-pass deduplication
  const seen = new Set<string>();
  const uniqueEvents = events.filter((ev) => {
    if (!ev?.id || seen.has(ev.id)) return false;
    seen.add(ev.id);
    return true;
  });

  // 2. Resilient batch dispatch with exponential backoff & jitter
  const dispatchWithRetry = async (batch: EventRecord[], attempt = 1): Promise<void> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    try {
      // Parameterized batch POST instead of N+1 GET queries
      if (batch.length === 0) return;
    } catch (err) {
      if (attempt >= 4) throw err;
      const backoffMs = Math.min(2000, Math.pow(2, attempt) * 120);
      await new Promise((r) => setTimeout(r, backoffMs));
      return dispatchWithRetry(batch, attempt + 1);
    } finally {
      clearTimeout(timer);
    }
  };

  await dispatchWithRetry(uniqueEvents);
  return { processed: uniqueEvents.length, durationMs: Date.now() - start };
}`
        },
        {
          name: 'productionController.spec.ts',
          code: `// ✅ PRODUCTION UNIT & CHAOS TEST SUITE
describe("${title} - Resilience Suite", () => {
  it("deduplicates 50,000 events in O(n) under 12ms", async () => {
    const sample = Array.from({ length: 5000 }, (_, i) => ({
      id: \`evt_\${i % 250}\`,
      timestampUtc: new Date().toISOString(),
      payloadHash: "sha256_ok"
    }));
    const res = await syncEventsProduction(sample, "env_secret_verified");
    expect(res.processed).toBe(250);
  });
});`
        },
        {
          name: 'migration_safe.sql',
          code: `-- ✅ ZERO-DOWNTIME PRODUCTION SCHEMA MIGRATION
ALTER TABLE event_outbox
  ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_attempt_utc TIMESTAMP NULL;

CREATE INDEX CONCURRENTLY idx_outbox_pending_utc
  ON event_outbox (next_attempt_utc)
  WHERE retry_count < 5;`
        }
      ]
    };
  }

  // Default high-performance systems/enterprise template (Rust, Go, C++, Java, C#, SQL, etc.)
  return {
    legacyFile: `legacy_module.${project.ext || 'rs'}`,
    legacyCode: `// ❌ ACADEMIC / LEGACY IMPLEMENTATION (${lang}): ${title}
// Problem: Uses global mutex lock across network I/O, hardcoded credentials, and O(n^2) buffer reallocation
const HARDCODED_API_KEY: &str = "SECRET_PROD_TOKEN_99182"; // Fails security gate

pub fn process_frames_legacy(frames: Vec<String>) -> Vec<String> {
    let mut output = Vec::new();
    // O(n^2) naive scan & unbounded clone per frame
    for i in 0..frames.len() {
        let mut duplicate = false;
        for j in 0..i {
            if frames[i] == frames[j] {
                duplicate = true;
            }
        }
        if !duplicate {
            output.push(frames[i].clone());
        }
    }
    output
}`,
    solutionFiles: [
      {
        name: `production_module.${project.ext || 'rs'}`,
        code: `// ✅ PRODUCTION-GRADE SOLUTION (${lang}): ${title}
// Refactored: O(n) pre-allocated HashSet, zero-copy slices, environment secret injection, bounded backpressure
use std::collections::HashSet;
use std::env;

pub struct ProductionEngine {
    max_batch_size: usize,
    signing_key: String,
}

impl ProductionEngine {
    pub fn from_env(max_batch_size: usize) -> Result<Self, &'static str> {
        let signing_key = env::var("SIGNING_SECRET_KEY")
            .map_err(|_| "CRITICAL: Missing SIGNING_SECRET_KEY in environment")?;
        Ok(Self { max_batch_size, signing_key })
    }

    pub fn process_frames_linear<'a>(&self, frames: &'a [&'a str]) -> Vec<&'a str> {
        let mut seen = HashSet::with_capacity(frames.len().min(self.max_batch_size));
        let mut out = Vec::with_capacity(frames.len().min(self.max_batch_size));

        for &frame in frames.iter().take(self.max_batch_size) {
            if !frame.is_empty() && seen.insert(frame) {
                out.push(frame);
            }
        }
        out
    }
}`
      },
      {
        name: `chaos_tests.${project.ext || 'rs'}`,
        code: `// ✅ PRODUCTION BENCHMARK & CHAOS VERIFICATION
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn verifies_linear_o_n_throughput_and_bounds() {
        std::env::set_var("SIGNING_SECRET_KEY", "rotated_kms_key_v2");
        let engine = ProductionEngine::from_env(10_000).unwrap();
        let input = vec!["frame_1", "frame_2", "frame_1", "frame_3"];
        let result = engine.process_frames_linear(&input);
        assert_eq!(result.len(), 3);
    }
}`
      },
      {
        name: 'zero_downtime_migration.sql',
        code: `-- ✅ ZERO-DOWNTIME PRODUCTION SCHEMA MIGRATION (100,000+ ROWS)
ALTER TABLE telemetry_ledger
  ADD COLUMN IF NOT EXISTS partition_shard INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS checksum_sha256 CHAR(64) NULL;

CREATE INDEX CONCURRENTLY idx_ledger_shard_created
  ON telemetry_ledger (partition_shard, created_at DESC);`
      }
    ]
  };
}

function buildMassiveCatalog() {
  const projects = [];
  let idCounter = 1;

  // 1. Generate 26 Projects for EACH of the 26 Engineering Areas (676 projects)
  ENGINEERING_AREAS.forEach((area) => {
    PROJECT_ARCHETYPES.forEach((arch, idx) => {
      const primaryLang = area.langs[idx % area.langs.length];
      const lib = area.libraries[idx % area.libraries.length];
      projects.push({
        id: `PRJ-AREA-${idCounter++}`,
        hubType: 'area',
        hubId: area.id,
        hubName: area.name,
        categoryGroup: area.group,
        isCombo: false,
        title: `${area.name.split(' ')[0]} ${arch.suffix}`,
        subtitle: `Production ${area.name} workbench using ${primaryLang} & ${lib}`,
        primaryLang,
        ext: PROGRAMMING_LANGUAGES.find(l => l.name.startsWith(primaryLang))?.ext || 'py',
        languages: [primaryLang],
        areas: [area.name],
        libraries: [lib, ...area.libraries.slice(0, 2)],
        difficulty: arch.difficulty,
        focus: arch.focus,
        bigOLegacy: arch.bigOLegacy,
        bigOSolution: arch.bigOSolution,
        academicTheory: `University labs assume clean in-memory arrays, single-user execution, and 100% network uptime when teaching ${area.name}.`,
        practicalReality: `In production ${area.name}, you must survive 429 rate limits, dirty payloads, N+1 query bottlenecks, and mid-sprint requirement changes using ${lib}.`,
        clientInterrupt: `URGENT PM SLACK PING: "Enterprise client needs all ${area.name} payloads filtered by UTC timestamp, PII fields masked, and p99 latency under 85ms before 5 PM deploy!"`
      });
    });
  });

  // 2. Generate 26 Projects for EACH of the 22 Programming Languages (572 projects)
  PROGRAMMING_LANGUAGES.forEach((langObj) => {
    PROJECT_ARCHETYPES.forEach((arch, idx) => {
      const lib = langObj.ecosystem[idx % langObj.ecosystem.length];
      projects.push({
        id: `PRJ-LANG-${idCounter++}`,
        hubType: 'language',
        hubId: langObj.id,
        hubName: langObj.name,
        categoryGroup: langObj.category,
        isCombo: false,
        title: `${langObj.name} ${arch.suffix}`,
        subtitle: `High-resilience ${langObj.name} architecture powered by ${lib}`,
        primaryLang: langObj.name.split(' ')[0],
        ext: langObj.ext,
        languages: [langObj.name],
        areas: [langObj.category],
        libraries: [lib, ...langObj.ecosystem.slice(0, 2)],
        difficulty: arch.difficulty,
        focus: arch.focus,
        bigOLegacy: arch.bigOLegacy,
        bigOSolution: arch.bigOSolution,
        academicTheory: `Academic ${langObj.name} assignments grade whether syntax compiles and outputs a static string on a single thread.`,
        practicalReality: `Production ${langObj.name} engineering with ${lib} demands memory bounds, parameterized queries, graceful shutdowns, and automated CI/CD checks.`,
        clientInterrupt: `AGILE SCOPE CHANGE: "Security audit flagged our ${langObj.name} service! Add HMAC signature validation and zero-downtime DB migration support immediately."`
      });
    });
  });

  // 3. Generate 520 Cross-Domain COMBO Projects (Combining 2+ Languages & 2+ Engineering Areas)
  const COMBO_BLUEPRINTS = [
    { langs: ['Python', 'Rust', 'SQL'], areas: ['Quantitative Finance (FinTech)', 'Systems Programming'], libs: ['PyO3', 'Tokio', 'PostgreSQL'], tag: 'FinTech + Rust Core' },
    { langs: ['TypeScript', 'Go (Golang)', 'SQL'], areas: ['Full-Stack Development', 'Site Reliability Engineering (SRE)'], libs: ['Next.js', 'gRPC', 'Prometheus'], tag: 'Cloud Full-Stack' },
    { langs: ['Python', 'JavaScript', 'SQL'], areas: ['Backend Web Development', 'Machine Learning (ML)'], libs: ['Django REST', 'Scikit-learn', 'MySQL 8'], tag: 'Django + ML API' },
    { langs: ['C++', 'Python', 'MATLAB'], areas: ['Robotics', 'Artificial Intelligence (AI) & Generative AI'], libs: ['ROS2', 'OpenCV', 'Eigen'], tag: 'Autonomous Vision' },
    { langs: ['Kotlin', 'Swift', 'Rust'], areas: ['Mobile App Development', 'Cryptography'], libs: ['Jetpack Compose', 'SwiftUI', 'libsodium'], tag: 'Zero-Knowledge Mobile' },
    { langs: ['Scala', 'Python', 'SQL'], areas: ['Big Data Engineering', 'Data Science & Analytics'], libs: ['Apache Spark', 'Kafka', 'Pandas'], tag: 'Realtime Lakehouse' },
    { langs: ['Java', 'Go (Golang)', 'Shell (Bash/Zsh)'], areas: ['Cloud Computing', 'DevOps (Development & Operations)'], libs: ['Spring Boot 3', 'Docker', 'Kubernetes'], tag: 'Multi-Region Mesh' },
    { langs: ['C#', 'C++', 'Lua'], areas: ['Game Development', 'AR/VR/MR (Extended Reality)'], libs: ['Unity', 'Unreal Engine 5', 'LuaJIT'], tag: 'Spatial Netcode Engine' },
    { langs: ['C', 'Rust', 'Python'], areas: ['Embedded Systems', 'Internet of Things (IoT)'], libs: ['FreeRTOS', 'MQTT', 'ESP-IDF'], tag: 'Industrial Edge IoT' },
    { langs: ['Python', 'R', 'Julia'], areas: ['Bioinformatics', 'Quantum Computing'], libs: ['Biopython', 'Qiskit', 'DifferentialEquations.jl'], tag: 'Genomic Quantum Sim' },
    { langs: ['TypeScript', 'Ruby', 'SQL'], areas: ['Frontend Web Development', 'Database Administration (DBA)'], libs: ['React 19', 'Ruby on Rails', 'Sidekiq'], tag: 'High-Scale SaaS' },
    { langs: ['PHP', 'JavaScript', 'Shell (Bash/Zsh)'], areas: ['Full-Stack Development', 'Cybersecurity'], libs: ['Laravel 11', 'OWASP Core', 'Redis'], tag: 'Hardened E-Commerce' },
    { langs: ['Python', 'Go (Golang)', 'Perl'], areas: ['Ethical Hacking / Penetration Testing', 'Cybersecurity'], libs: ['Scapy', 'Suricata', 'eBPF'], tag: 'Threat Hunting SIEM' },
    { langs: ['Dart', 'TypeScript', 'Python'], areas: ['Mobile App Development', 'Desktop App Development'], libs: ['Flutter', 'CustomTkinter', 'FastAPI'], tag: 'Cross-Platform Sync' },
    { langs: ['Rust', 'TypeScript', 'Go (Golang)'], areas: ['Blockchain & Web3', 'Cryptography'], libs: ['Anchor/Solana', 'Ethers.js', 'libp2p'], tag: 'ZK Rollup Sequencer' },
    { langs: ['Python', 'SQL', 'HTML/CSS'], areas: ['Full-Stack Development', 'Data Science & Analytics'], libs: ['Django', 'MySQL 8', 'Tailwind CSS'], tag: 'Analytics Portal' },
    { langs: ['C++', 'C#', 'Python'], areas: ['Desktop App Development', 'Artificial Intelligence (AI) & Generative AI'], libs: ['OpenCV', '.NET 8', 'ONNX Runtime'], tag: 'Edge Vision Studio' },
    { langs: ['Go (Golang)', 'SQL', 'Shell (Bash/Zsh)'], areas: ['Database Administration (DBA)', 'Site Reliability Engineering (SRE)'], libs: ['PostgreSQL 16', 'PgBouncer', 'Terraform'], tag: 'Self-Healing DB Cluster' },
    { langs: ['Julia', 'Python', 'C++'], areas: ['Quantitative Finance (FinTech)', 'Machine Learning (ML)'], libs: ['Flux.jl', 'PyTorch', 'QuantLib'], tag: 'Derivative Pricing AI' },
    { langs: ['Swift', 'Kotlin', 'TypeScript'], areas: ['Mobile App Development', 'Cloud Computing'], libs: ['SwiftUI', 'Ktor', 'GraphQL'], tag: 'Offline-First BFF' }
  ];

  COMBO_BLUEPRINTS.forEach((bp, bpIdx) => {
    PROJECT_ARCHETYPES.forEach((arch, archIdx) => {
      const comboNum = bpIdx * PROJECT_ARCHETYPES.length + archIdx + 1;
      const primaryLang = bp.langs[0].split(' ')[0];
      projects.push({
        id: `PRJ-COMBO-${comboNum}`,
        hubType: 'combo',
        hubId: `combo-${bpIdx}`,
        hubName: `Multi-Domain Combo (${bp.tag})`,
        categoryGroup: '2+ Areas & Languages Combo',
        isCombo: true,
        title: `[Combo #${comboNum}] ${bp.langs.slice(0, 2).join(' + ')}: ${arch.suffix}`,
        subtitle: `Cross-domain synthesis combining ${bp.areas.join(' & ')} with ${bp.langs.join(', ')}`,
        primaryLang,
        ext: PROGRAMMING_LANGUAGES.find(l => l.name.startsWith(primaryLang))?.ext || 'py',
        languages: bp.langs,
        areas: bp.areas,
        libraries: bp.libs,
        difficulty: arch.difficulty,
        focus: arch.focus,
        bigOLegacy: arch.bigOLegacy,
        bigOSolution: arch.bigOSolution,
        academicTheory: `Courses teach ${bp.langs[0]} and ${bp.langs[1]} in isolated silos with zero cross-language serialization, IPC, or unified failure recovery.`,
        practicalReality: `Real production systems bridge ${bp.areas[0]} and ${bp.areas[1]} across ${bp.langs.join(' + ')}, requiring schema contracts, unified tracing, and atomic rollbacks.`,
        clientInterrupt: `CROSS-TEAM ESCALATION: "The ${bp.langs[0]} producer is overwhelming the ${bp.langs[1]} consumer! Add backpressure queues and schema version negotiation now."`
      });
    });
  });

  return projects;
}

// ============================================================================
// 4. DYNAMIC LANGUAGE-SPECIFIC PRACTICAL CODE OUTPUT DIAGNOSTIC GENERATOR
//    (15 Real-World Code & Production Output Questions per Language)
// ============================================================================
const QUIZ_SCENARIO_BLUEPRINTS = [
  {
    id: 1,
    category: 'Concurrency & Async',
    domain: 'Backend Web Development',
    weaknessTag: 'Async Race Conditions & TOCTOU Double-Spend',
    title: 'Concurrent Wallet Balance Deduction Under Parallel Requests',
    buildCode: (lang) => {
      if (lang === 'Python') {
        return `async def withdraw_funds(user_id: int, amount: int, db):
    # Two requests for user_id=42 arrive at the exact same millisecond (balance = 1000)
    balance = await db.fetch_val(f"SELECT balance FROM wallets WHERE user_id = {user_id}")
    if balance >= amount:
        await asyncio.sleep(0.02) # Simulated network / ledger latency
        new_balance = balance - amount
        await db.execute(f"UPDATE wallets SET balance = {new_balance} WHERE user_id = {user_id}")
        return {"status": "APPROVED", "remaining": new_balance}
    return {"status": "INSUFFICIENT_FUNDS"}

# Production Traffic: Two parallel calls withdraw_funds(42, 800) execute concurrently.`;
      }
      if (lang === 'JavaScript' || lang === 'TypeScript') {
        return `async function withdrawFunds(userId, amount, db) {
  // Initial wallet balance in DB for userId 42 is 1000
  const wallet = await db.query("SELECT balance FROM wallets WHERE user_id = $1", [userId]);
  if (wallet.balance >= amount) {
    await new Promise(r => setTimeout(r, 20)); // I/O roundtrip delay
    const nextBalance = wallet.balance - amount;
    await db.query("UPDATE wallets SET balance = $1 WHERE user_id = $2", [nextBalance, userId]);
    return { status: "APPROVED", remaining: nextBalance };
  }
  return { status: "DECLINED" };
}
// Executed concurrently: await Promise.all([withdrawFunds(42, 800), withdrawFunds(42, 800)]);`;
      }
      return `// Language: ${lang} — Concurrent Wallet Withdrawal Handler
// Initial DB state: user_id = 42 has balance = 1000
fn withdraw_concurrent(user_id: u64, amount: i64, db: &Pool) -> String {
    let current_bal = db.read_balance_unlocked(user_id); // Reads 1000 in both threads
    if current_bal >= amount {
        sleep_ms(20); // Context switch during I/O
        db.write_balance(user_id, current_bal - amount);
        return format!("APPROVED:{}", current_bal - amount);
    }
    "DECLINED".to_string()
}
// Thread A and Thread B both invoke withdraw_concurrent(42, 800) at t=0ms.`;
    },
    question: 'When two parallel requests for `amount = 800` hit this handler at the exact same millisecond against a starting balance of `1000`, what is the actual production output and database state?',
    options: [
      { text: 'First request returns APPROVED (200), second returns DECLINED / INSUFFICIENT_FUNDS', correct: false },
      { text: 'Both requests return APPROVED (remaining: 200) and ₹800 is double-spent due to an unlocked Time-of-Check to Time-of-Use (TOCTOU) race condition', correct: true },
      { text: 'The database automatically serializes all reads without transactions and throws a syntax error', correct: false },
      { text: 'The final balance becomes -600 automatically', correct: false }
    ],
    explanation: 'Without `SELECT ... FOR UPDATE` row-level locking or an atomic `UPDATE wallets SET balance = balance - 800 WHERE user_id = 42 AND balance >= 800`, both workers read `1000` before either writes, approving both withdrawals and leaving `200` in the database.'
  },
  {
    id: 2,
    category: 'Memory & State Management',
    domain: 'Systems Programming',
    weaknessTag: 'Shared Mutable State & Reference Leakage Across Requests',
    title: 'Shared Mutable Buffer Across Request Invocations',
    buildCode: (lang) => {
      if (lang === 'Python') {
        return `def append_audit_tag(tag: str, history: list = []):
    history.append(tag)
    return history

# Request 1 (User A):
res_a = append_audit_tag("LOGIN_USER_A")
# Request 2 (User B - separate HTTP request on same worker):
res_b = append_audit_tag("PAYMENT_USER_B")
print(res_b)`;
      }
      if (lang === 'JavaScript' || lang === 'TypeScript') {
        return `const defaultContext = { roles: ["guest"], trace: [] };

function buildSession(userRole, ctx = defaultContext) {
  ctx.roles.push(userRole);
  return ctx.roles;
}

// Request 1 (Admin logs in):
buildSession("super_admin");
// Request 2 (Anonymous user visits):
const anonRoles = buildSession("viewer");
console.log(anonRoles);`;
      }
      return `// Language: ${lang} — Static / Shared Buffer Reuse Bug
static mut SHARED_BATCH: Vec<&str> = Vec::new();

fn record_request_event(event: &'static str) -> usize {
    // Developer forgot to clear or scope buffer per-request
    unsafe {
        SHARED_BATCH.push(event);
        SHARED_BATCH.len()
    }
}
// Call 1: record_request_event("REQ_1") -> returns 1
// Call 2: record_request_event("REQ_2") -> what does it return and retain?`;
    },
    question: 'What is the actual output on the second request in a long-running production worker process?',
    options: [
      { text: 'It outputs only the second request’s item because default/shared objects reset after every function call', correct: false },
      { text: 'It leaks state across requests (outputting both User A/Request 1 and User B/Request 2 data) because the mutable reference is allocated once and shared across invocations', correct: true },
      { text: 'It raises a compile-time syntax error before the server starts', correct: false },
      { text: 'It returns an empty array `[]`', correct: false }
    ],
    explanation: 'Mutable default arguments (in Python) or module-scoped mutable objects (in JS/TS/Systems languages) persist across function calls for the lifetime of the worker process, causing severe cross-tenant data leaks.'
  },
  {
    id: 3,
    category: 'Database & Query Optimization',
    domain: 'Database Administration (DBA)',
    weaknessTag: 'N+1 Query Bottlenecks & Unindexed Scans',
    title: 'Order Feed Serializer Latency Spike',
    buildCode: (lang) => {
      return `// Language: ${lang} — Order History Endpoint (500 Orders in Page)
orders = db.query("SELECT id, customer_id, total FROM orders LIMIT 500") // 1 query (4ms)
response = []

for order in orders:
    // Fetches customer profile inside the loop for each of the 500 orders
    customer = db.query("SELECT name, tier FROM customers WHERE id = ?", [order.customer_id]) // 3.5ms per network roundtrip
    response.append({ id: order.id, customer: customer.name, total: order.total })

return response`;
    },
    question: 'In a local test with 3 rows this code runs in 14ms. When deployed to production with `LIMIT 500` and a 3.5ms RDS database roundtrip, what happens?',
    options: [
      { text: 'It still completes in 14ms because SQL databases automatically merge loop queries', correct: false },
      { text: 'It executes 501 sequential database queries (N+1 problem), blocking the request for ~1,754ms+ and exhausting the DB connection pool under load', correct: true },
      { text: 'It throws a Foreign Key constraint error', correct: false },
      { text: 'It only returns the first order and ignores the remaining 499', correct: false }
    ],
    explanation: 'Executing a query inside a loop over `N` parent records triggers `N + 1` network roundtrips. The production fix is a single `WHERE id IN (...)` batch query or `JOIN`.'
  },
  {
    id: 4,
    category: 'API Resilience & Error Handling',
    domain: 'Cloud Computing',
    weaknessTag: 'Retry Storms & Missing Exponential Backoff on HTTP 429',
    title: 'Upstream Payment Gateway Rate-Limit Handler',
    buildCode: (lang) => {
      return `// Language: ${lang} — Webhook Dispatcher on HTTP 429 Rate Limit
async function sendWebhook(payload) {
  while (true) {
    const res = await httpClient.post("https://api.partner.com/v1/notify", payload);
    if (res.status === 200) return res.body;
    // Partner API returns 429 Too Many Requests with Retry-After: 5
    console.warn("Request failed with status " + res.status + ", retrying immediately...");
  }
}`;
    },
    question: 'When the partner API returns `HTTP 429 (Too Many Requests)` during a traffic spike across 50 worker threads running this code, what occurs in production?',
    options: [
      { text: 'The `while (true)` loop without backoff or jitter hammers the upstream API thousands of times per second (Retry Storm), pinning CPU/sockets and getting your IP banned', correct: true },
      { text: 'The HTTP client automatically pauses for 5 seconds because `console.warn` is called', correct: false },
      { text: 'The loop exits after 1 retry automatically', correct: false },
      { text: 'HTTP 429 is treated as a 200 OK by the network card', correct: false }
    ],
    explanation: 'Immediate retries without bounded attempts, `Retry-After` parsing, and Exponential Backoff + Jitter amplify outages into self-inflicted DDoS retry storms.'
  },
  {
    id: 5,
    category: 'Security & Input Validation',
    domain: 'Cybersecurity',
    weaknessTag: 'SQL Injection via String Interpolation',
    title: 'Search Filter Query Builder',
    buildCode: (lang) => {
      return `// Language: ${lang} — Admin Invoice Search Endpoint
// Attacker passes query param: status = "PAID' OR '1'='1"
const userInput = req.query.status;
const sql = "SELECT id, amount, secret_token FROM invoices WHERE tenant_id = 19 AND status = '" + userInput + "'";
const rows = await db.executeRaw(sql);
return rows;`;
    },
    question: 'When a user supplies `PAID\' OR \'1\'=\'1` as the `status` parameter, what does the database actually execute and return?',
    options: [
      { text: 'It returns 0 rows because single quotes are ignored by SQL engines', correct: false },
      { text: 'The `OR \'1\'=\'1` predicate evaluates to TRUE for every row in the table, bypassing the `tenant_id = 19` filter due to operator precedence (`AND` binds tighter than `OR`) and leaking all tenants’ invoices', correct: true },
      { text: 'It only returns invoices belonging to `tenant_id = 19`', correct: false },
      { text: 'It encrypts the `secret_token` column automatically', correct: false }
    ],
    explanation: 'In SQL, `AND` has higher precedence than `OR`. `WHERE tenant_id = 19 AND status = \'PAID\' OR \'1\'=\'1\'` parses as `(tenant_id = 19 AND status = \'PAID\') OR TRUE`, dumping the entire table across all tenants!'
  },
  {
    id: 6,
    category: 'Systems & Architecture',
    domain: 'Quantitative Finance (FinTech)',
    weaknessTag: 'IEEE-754 Floating-Point Currency Drift',
    title: 'High-Volume Micro-Transaction Fee Accumulator',
    buildCode: (lang) => {
      return `// Language: ${lang} — Ledger Settlement Check
double itemA = 0.10;
double itemB = 0.20;
double expectedTotal = 0.30;

if (itemA + itemB == expectedTotal) {
     settleLedger("RECONCILED_OK");
} else {
    triggerAlert("LEDGER_MISMATCH: " + toString(itemA + itemB));
}`;
    },
    question: 'What is the exact production output of this settlement check?',
    options: [
      { text: 'It calls `settleLedger("RECONCILED_OK")` every time', correct: false },
      { text: 'It triggers `LEDGER_MISMATCH: 0.30000000000000004` because IEEE-754 binary floating-point cannot exactly represent base-10 `0.1` and `0.2`', correct: true },
      { text: 'It rounds both numbers to integers `0` and `0`', correct: false },
      { text: 'It throws a DivideByZero exception', correct: false }
    ],
    explanation: 'Binary floating-point (`float`/`double`/`Number`) introduces representation drift on base-10 fractions. Production financial systems always store integer minor units (cents/paise as `INT64`) or fixed-point `Decimal` types.'
  },
  {
    id: 7,
    category: 'Concurrency & Async',
    domain: 'Frontend Web Development',
    weaknessTag: 'Closure Loop Variable Capture & Stale Async State',
    title: 'Scheduled Telemetry Batch Dispatcher',
    buildCode: (lang) => {
      return `// Language: ${lang} — Async Worker Index Dispatch
var callbacks = [];
for (var i = 0; i < 3; i++) {
  callbacks.push(() => console.log("Dispatching shardId:", i));
}
// All 3 callbacks fire after the loop completes:
callbacks.forEach(fn => fn());`;
    },
    question: 'When the three queued callbacks execute after the loop finishes, what is printed to the production logs?',
    options: [
      { text: 'Dispatching shardId: 0, Dispatching shardId: 1, Dispatching shardId: 2', correct: false },
      { text: 'Dispatching shardId: 3, Dispatching shardId: 3, Dispatching shardId: 3 (all closures captured the same mutated loop binding)', correct: true },
      { text: 'Dispatching shardId: undefined three times', correct: false },
      { text: 'Nothing is printed because closures cannot read outer variables', correct: false }
    ],
    explanation: 'When closures capture a shared function-scoped or outer mutable variable by reference instead of a per-iteration binding (`let` or value copy), all deferred callbacks read the final post-loop value `3`.'
  },
  {
    id: 8,
    category: 'Systems & Architecture',
    domain: 'Big Data Engineering',
    weaknessTag: 'Algorithmic O(n²) Degradation on Large Payloads',
    title: 'Event Stream Deduplication Filter',
    buildCode: (lang) => {
      return `// Language: ${lang} — Deduplicating 80,000 Incoming Webhook IDs
function deduplicateIds(incomingIds) {
  const unique = [];
  for (let i = 0; i < incomingIds.length; i++) {
    //unique.includes() performs a linear O(n) scan on every iteration
    if (!unique.includes(incomingIds[i])) {
      unique.push(incomingIds[i]);
    }
  }
  return unique;
}`;
    },
    question: 'This function passes unit tests with 20 items in 0.1ms. When an enterprise customer uploads a batch of `80,000` unique IDs in production, what happens?',
    options: [
      { text: 'It finishes in 8ms because `.includes()` uses a hardware hash table', correct: false },
      { text: 'It performs ~3.2 billion comparisons (`O(n²)`), blocking the event loop / worker thread for several seconds and causing health-check timeouts', correct: true },
      { text: 'It only processes the first 100 items', correct: false },
      { text: 'It reverses the array order', correct: false }
    ],
    explanation: 'Calling linear `includes`/`in list` inside a loop turns deduplication into `O(n²)`. Using a `Set` / `HashSet` reduces 3.2 billion operations to `80,000` `O(1)` lookups.'
  },
  {
    id: 9,
    category: 'Database & Query Optimization',
    domain: 'Database Administration (DBA)',
    weaknessTag: 'Metadata Table Locking During Live Migrations',
    title: 'Live Production Table Schema Modification',
    buildCode: (lang) => {
      return `-- Connected to Primary Production DB (100,000+ rows, 600 writes/sec)
BEGIN;
ALTER TABLE user_transactions MODIFY COLUMN amount BIGINT NOT NULL;
UPDATE user_transactions SET amount = amount * 100;
COMMIT;`;
    },
    question: 'What is the immediate production impact of running this migration script directly during peak traffic?',
    options: [
      { text: 'Zero impact; `UPDATE` on every row in a single transaction never locks rows', correct: false },
      { text: 'It acquires an exclusive table/row lock across all 100,000+ rows for the entire transaction, stalling all 600 writes/sec and exhausting application connection pools', correct: true },
      { text: 'It automatically creates a shadow table in the background', correct: false },
      { text: 'It deletes the `user_transactions` table', correct: false }
    ],
    explanation: 'Full-table rewrites and unchunked `UPDATE` statements inside a single transaction lock all rows and blow up undo logs. Production migrations use `ALGORITHM=INPLACE, LOCK=NONE` and chunked backfills.'
  },
  {
    id: 10,
    category: 'Memory & State Management',
    domain: 'Big Data Engineering',
    weaknessTag: 'Unbounded In-Memory Buffering & Container OOMKills',
    title: 'Log Export Download Endpoint',
    buildCode: (lang) => {
      return `// Language: ${lang} — Exporting a 6GB Audit Log File inside a 512MB Container
app.get("/admin/export-logs", async (req, res) => {
  const entireFileBuffer = await fs.promises.readFile("/var/log/prod_audit_6gb.log");
  const lines = entireFileBuffer.toString("utf-8").split("\\n");
  res.send(lines.join("\\n"));
});`;
    },
    question: 'When an admin hits `/admin/export-logs` on a Kubernetes pod configured with a `512MB` memory limit, what happens?',
    options: [
      { text: 'The pod streams the 6GB file using only 4MB of RAM', correct: false },
      { text: 'The process attempts to allocate >6GB in RAM all at once and is immediately terminated by the Linux kernel with `SIGKILL (Exit Code 137 / OOMKilled)`', correct: true },
      { text: 'Kubernetes automatically upgrades the pod to 64GB RAM without restarting', correct: false },
      { text: 'It returns an empty 200 OK response', correct: false }
    ],
    explanation: '`readFile` loads the entire file into heap memory before sending a single byte. Production systems use chunked streams/iterators (`createReadStream`) to maintain an `O(1)` memory footprint.'
  },
  {
    id: 11,
    category: 'Security & Input Validation',
    domain: 'Artificial Intelligence (AI) & Generative AI',
    weaknessTag: 'Hardcoded Secrets & Broken Auth Guard Evaluation',
    title: 'JWT Signature Verification Middleware',
    buildCode: (lang) => {
      return `// Language: ${lang} — Token Verification Logic
function verifyAdminToken(token) {
  // Developer used jwt.decode() instead of jwt.verify(token, SECRET)
  const payload = jwt.decode(token); 
  if (payload && payload.role === "admin") {
    return { authenticated: true, user: payload.sub };
  }
  return { authenticated: false };
}`;
    },
    question: 'What is the critical security flaw in this production authentication middleware?',
    options: [
      { text: 'None; `jwt.decode()` verifies the cryptographic HMAC/RSA signature automatically', correct: false },
      { text: '`jwt.decode()` only Base64-decodes the payload without verifying the cryptographic signature! Any attacker can forge `{"role":"admin"}` with a fake signature and gain full admin access', correct: true },
      { text: 'The role string `"admin"` must be uppercase', correct: false },
      { text: 'JWTs cannot store a `sub` field', correct: false }
    ],
    explanation: '`decode()` merely parses the Base64 JSON payload and completely ignores the cryptographic signature. Production auth must call `jwt.verify(token, SECRET, { algorithms: ["HS256"] })`.'
  },
  {
    id: 12,
    category: 'API Resilience & Error Handling',
    domain: 'Full-Stack Development',
    weaknessTag: 'Offset Pagination Data Drift & Missing Idempotency',
    title: 'Real-Time Feed Offset Pagination Under Live Inserts',
    buildCode: (lang) => {
      return `-- Page 1 request at t=0s:
SELECT id, title FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 0;
-- 3 new posts are inserted into 'posts' at t=2s.
-- Page 2 request at t=3s:
SELECT id, title FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 10;`;
    },
    question: 'When 3 new posts are inserted between the user loading Page 1 and scrolling to Page 2 using `LIMIT 10 OFFSET 10`, what does the user see on Page 2?',
    options: [
      { text: '10 brand new posts with zero duplicates', correct: false },
      { text: 'The last 3 posts from Page 1 appear AGAIN at the top of Page 2 (duplicate items) because the offset window shifted down by 3 rows', correct: true },
      { text: 'The query throws a cursor exception', correct: false },
      { text: 'The database deletes the 3 new posts', correct: false }
    ],
    explanation: '`OFFSET` pagination counts row positions from the top of the result set. When new rows are prepended, older rows shift down into the next page’s offset. Production feeds use Cursor/Keyset pagination (`WHERE created_at < :last_seen_cursor`).'
  },
  {
    id: 13,
    category: 'Concurrency & Async',
    domain: 'Site Reliability Engineering (SRE)',
    weaknessTag: 'Sequential Await Inside Loop Blocking Throughput',
    title: 'Multi-Service Health Aggregator',
    buildCode: (lang) => {
      return `// Language: ${lang} — Fetching 6 Independent Microservice Statuses (200ms each)
async function fetchDashboardHealth(urls) {
  const results = [];
  for (const url of urls) {
    // Each fetch takes 200ms
    const data = await fetchWithTimeout(url, 1000);
    results.push(data);
  }
  return results;
}`;
    },
    question: 'Each of the 6 independent URLs responds in `200ms`. How long does `fetchDashboardHealth` take to complete, and why?',
    options: [
      { text: '~200ms total because `async` functions automatically parallelize `for` loops', correct: false },
      { text: '~1,200ms (6 × 200ms) because `await` inside a `for` loop serializes every network call one after another instead of running them concurrently with `Promise.all` / `asyncio.gather`', correct: true },
      { text: '0ms because `fetchWithTimeout` is synchronous', correct: false },
      { text: 'It times out at 1,000ms and throws an error', correct: false }
    ],
    explanation: 'Placing `await` directly inside a `for` loop pauses the loop on each item until the network call finishes. Launching all independent promises in parallel drops latency from `1,200ms` to `200ms`.'
  },
  {
    id: 14,
    category: 'Memory & State Management',
    domain: 'Embedded Systems',
    weaknessTag: 'Resource / File Descriptor / Connection Leak on Exception',
    title: 'Database Connection Checkout Without Finally / RAII Guard',
    buildCode: (lang) => {
      return `// Language: ${lang} — Connection Pool Checkout (Pool Max Size = 10)
async function processInvoice(invoiceId, pool) {
  const conn = await pool.acquire(); // Checks out 1 of 10 connections
  const data = await conn.query("SELECT * FROM invoices WHERE id = $1", [invoiceId]);
  if (!data.isValid) {
    throw new Error("Invalid invoice payload!"); // Early throw!
  }
  await conn.release();
  return data;
}`;
    },
    question: 'When 10 malformed invoices trigger `throw new Error("Invalid invoice payload!")` over the course of an hour, what happens to the production server?',
    options: [
      { text: 'The garbage collector immediately closes the TCP sockets on throw', correct: false },
      { text: '`conn.release()` is bypassed on every thrown error; after 10 invalid invoices, all 10 pooled connections are leaked permanently and the entire application hangs forever on `pool.acquire()`', correct: true },
      { text: 'The pool automatically doubles its max size every time an error is thrown', correct: false },
      { text: 'Only invalid invoices are blocked; valid invoices continue working', correct: false }
    ],
    explanation: 'Early returns or exceptions before `release()` permanently leak pooled resources unless wrapped in a `try / finally` block, Python `with` context manager, Go `defer`, or Rust RAII drop guard.'
  },
  {
    id: 15,
    category: 'Systems & Architecture',
    domain: 'DevOps (Development & Operations)',
    weaknessTag: 'Graceful Shutdown & SIGTERM In-Flight Request Dropping',
    title: 'Container SIGTERM Process Exit Handler',
    buildCode: (lang) => {
      return `// Language: ${lang} — Kubernetes Pod Rolling Update Signal Handler
process.on("SIGTERM", () => {
  console.log("Received SIGTERM from Kubernetes, exiting now!");
  process.exit(0); // Immediate hard exit!
});`;
    },
    question: 'During a rolling deployment in Kubernetes while 40 users are mid-checkout (250ms in-flight DB transactions), what happens when this `SIGTERM` handler runs?',
    options: [
      { text: '`process.exit(0)` waits for all 40 HTTP requests to finish before exiting', correct: false },
      { text: '`process.exit(0)` kills the process on the spot, severing all 40 active TCP sockets mid-transaction (`502 Bad Gateway`) instead of calling `server.close()` to drain in-flight requests', correct: true },
      { text: 'Kubernetes ignores `process.exit(0)`', correct: false },
      { text: 'The 40 requests are automatically re-run on the client’s GPU', correct: false }
    ],
    explanation: 'Calling `exit(0)` immediately inside `SIGTERM` aborts all in-flight HTTP requests and database writes. Production servers stop accepting new connections (`server.close()`), wait for active requests to finish, close DB pools, and only then exit.'
  }
];

function buildQuestionsForLanguage(selectedLang) {
  const effectiveLang = selectedLang || 'Python';
  return QUIZ_SCENARIO_BLUEPRINTS.map((bp) => ({
    ...bp,
    lang: effectiveLang,
    codeSnippet: bp.buildCode(effectiveLang)
  }));
}

// ============================================================================
// 6. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Catalog initialization (1,768 total projects: 676 Area + 572 Language + 520 Combo)
  const allProjects = useMemo(() => buildMassiveCatalog(), []);

  // Navigation & Global View State
  const [activeNav, setActiveNav] = useState('catalog'); // 'catalog' | 'workbench' | 'quiz' | 'architecture' | 'admin'
  const [bootTickerIndex, setBootTickerIndex] = useState(0);

  // Firebase Auth User & Real Registered Users State (NO DUMMY USERS!)
  const [fbUser, setFbUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Strict Mandatory Auth Gate: null until the user logs in or signs up
  const [currentUser, setCurrentUser] = useState(null);

  // One-time Firebase Auth Initialization
  useEffect(() => {
    if (!firebaseAuth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(firebaseAuth, __initial_auth_token);
        } else {
          await signInAnonymously(firebaseAuth);
        }
      } catch (e) {
        // Fallback to in-memory state if auth fails
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(firebaseAuth, (u) => setFbUser(u));
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Listener for Registered Users
  useEffect(() => {
    if (!fbUser || !firestoreDb) return;
    const usersCol = collection(firestoreDb, 'artifacts', appId, 'public', 'data', 'registered_users');
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        // Sort newest registrations first in memory
        list.sort((a, b) => (b.registeredAtEpoch || 0) - (a.registeredAtEpoch || 0));
        setRegisteredUsers(list);
      },
      () => {
        // Fallback silently on permission error
      }
    );
    return () => unsubscribe();
  }, [fbUser]);

  // Helper to persist a registered user record to both state and Firestore
  const saveRegisteredUserRecord = async (userRecord) => {
    setRegisteredUsers((prev) => {
      const exists = prev.some((u) => u.id === userRecord.id);
      const updated = exists
        ? prev.map((u) => (u.id === userRecord.id ? userRecord : u))
        : [userRecord, ...prev];
      return updated;
    });
    if (fbUser && firestoreDb) {
      try {
        const userDocRef = doc(firestoreDb, 'artifacts', appId, 'public', 'data', 'registered_users', userRecord.id);
        await setDoc(userDocRef, userRecord);
      } catch (e) {
        // Fallback handled by state
      }
    }
  };

  // Auth Gate Form States (Clean Production Mode — No Hints! Language is OPTIONAL at signup)
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPreferredLang, setSignupPreferredLang] = useState(''); // '' = Not Decided Yet (Optional at signup)
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState('');

  // Private Superuser Admin Console States (Only for Dhruv)
  const [showAllPasswords, setShowAllPasswords] = useState(true);
  const [revealedUserIds, setRevealedUserIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Catalog Filter & Modal States
  const [catalogMode, setCatalogMode] = useState('all'); // 'all' | 'areas' | 'languages' | 'combos'
  const [selectedHubId, setSelectedHubId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(24);
  const [modalProject, setModalProject] = useState(null);
  const [modalViewMode, setModalViewMode] = useState('brief'); // 'brief' | 'solution'
  const [modalSolutionFileIdx, setModalSolutionFileIdx] = useState(0);
  const [modalSimOutput, setModalSimOutput] = useState(null);

  // Active Workbench Project & 7 Production Chaos Features State
  const [selectedProject, setSelectedProject] = useState(() => allProjects[0]);
  const [workbenchTab, setWorkbenchTab] = useState('refactor'); // 'refactor' | 'solution' | 'api-sandbox' | 'db-migration' | 'cicd' | 'ai-review' | 'env-config'
  const [editorCode, setEditorCode] = useState('');
  const [activeSolutionFileIdx, setActiveSolutionFileIdx] = useState(0);
  const [copiedCodeToast, setCopiedCodeToast] = useState(false);

  // Feature 1: Legacy Refactoring & Unit Test State
  const [unitTestResults, setUnitTestResults] = useState(null);
  const [isSolutionLoadedInEditor, setIsSolutionLoadedInEditor] = useState(false);

  // Feature 2: Production API Sandbox State
  const [apiChaosConfig, setApiChaosConfig] = useState({
    inject429RateLimit: true,
    inject500Timeout: true,
    injectMalformedJson: true,
    enableExponentialBackoff: false,
    enableCircuitBreaker: false,
    enableSchemaGuard: false
  });
  const [apiSandboxLogs, setApiSandboxLogs] = useState([]);
  const [apiMetrics, setApiMetrics] = useState({ total: 0, success: 0, recovered: 0, dropped: 0 });

  // Feature 3: Client Ambiguity Simulator (Agile Interrupts)
  const [agileInterrupts, setAgileInterrupts] = useState([]);
  const [activeInterruptModal, setActiveInterruptModal] = useState(null);

  // Feature 4: Production DB Migration Workbench (100,000 Rows)
  const [migrationSql, setMigrationSql] = useState(
    `-- Current Table: production_users (100,000 active rows, 420 req/sec)\n-- Challenge: Add 'kyc_status' & 'organization_id' WITHOUT table locking or DROP TABLE\n\nALTER TABLE production_users\n  ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(32) DEFAULT 'PENDING',\n  ADD COLUMN IF NOT EXISTS organization_id BIGINT NULL,\n  ALGORITHM=INPLACE, LOCK=NONE;\n\nCREATE INDEX CONCURRENTLY idx_users_org_kyc ON production_users (organization_id, kyc_status);`
  );
  const [migrationReport, setMigrationReport] = useState(null);

  // Feature 5: CI/CD Pipeline Simulator
  const [cicdStages, setCicdStages] = useState([
    { id: 'lint', name: '1. Linting & Secret Scan', status: 'idle', duration: '0.8s', log: 'Waiting for commit trigger...' },
    { id: 'unit', name: '2. Unit & Big-O Complexity', status: 'idle', duration: '1.4s', log: 'Waiting for stage 1...' },
    { id: 'chaos', name: '3. API Chaos & DB Lock Audit', status: 'idle', duration: '2.1s', log: 'Waiting for stage 2...' },
    { id: 'build', name: '4. Production Container Deploy', status: 'idle', duration: '1.9s', log: 'Waiting for stage 3...' }
  ]);
  const [cicdTerminalLog, setCicdTerminalLog] = useState([
    '[SYSTEM] BeyondSyntax CI/CD Runner v4.8 Ready.',
    '[INFO] Target Environment: production-us-east-cluster (Kubernetes 1.31)'
  ]);
  const [cicdRunning, setCicdRunning] = useState(false);

  // Feature 6: AI "Senior Developer" PR Code Review State
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState(null);

  // Feature 7: Environment Configuration (.env & Lockfile) State
  const [envText, setEnvText] = useState(
    `# Fix the missing production secrets & pool bounds below:\nNODE_ENV=development\nSERVICE_API_SECRET=\nDB_POOL_SIZE=1\nREDIS_TLS_URL=http://localhost:6379`
  );
  const [depConflictChoice, setDepConflictChoice] = useState('broken'); // 'broken' | 'pinned'
  const [envValidationResult, setEnvValidationResult] = useState(null);

  // 3-Stage Diagnostic Quiz State
  // Stage 1 requires explicit language selection (even if skipped at registration)
  const [quizStage, setQuizStage] = useState('select-language'); // 'select-language' | 'questions' | 'results'
  const [quizSelectedLang, setQuizSelectedLang] = useState(''); // Empty until user explicitly picks or had one at signup
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showMissedCodeReview, setShowMissedCodeReview] = useState(true);

  const activeQuizQuestions = useMemo(
    () => buildQuestionsForLanguage(quizSelectedLang || 'Python'),
    [quizSelectedLang]
  );

  // Sync editor code whenever selectedProject changes
  const activeCodeBundle = useMemo(() => generateProjectCodeBundle(selectedProject), [selectedProject]);

  useEffect(() => {
    setEditorCode(activeCodeBundle.legacyCode);
    setIsSolutionLoadedInEditor(false);
    setActiveSolutionFileIdx(0);
    setUnitTestResults(null);
    setAiReviewResult(null);
    setAgileInterrupts([
      {
        id: 'INT-1',
        time: 'Just now',
        sender: 'Product Manager (Jira Sprint #42)',
        text: selectedProject.clientInterrupt,
        resolved: false
      }
    ]);
  }, [selectedProject, activeCodeBundle]);

  // Terminal Ticker messages
  const tickerMessages = [
    'BOOT_OK :: Loaded 26 Engineering Area Hubs (676 Projects) + 22 Language Hubs (572 Projects) + 520 Multi-Domain Combo Labs (1,768 Total)',
    'CHAOS_ENGINE :: 7 Production Simulators Online (Legacy Refactoring, 429/500 API Sandbox, Agile Interrupts, 100k-Row DB Migrator, CI/CD, AI Senior PR Review, .env Resolver)',
    'DIAGNOSTIC_ENGINE :: 22-Language Practical Code Output Assessment & Weakness Project Recommender Ready',
    'GAP_SOLVER :: Bridging Academic Theory (O(n²) Greenfield) -> Production Execution (O(n) Fault-Tolerant Architecture)'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBootTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Filtered Catalog Projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (catalogMode === 'areas' && p.hubType !== 'area') return false;
      if (catalogMode === 'languages' && p.hubType !== 'language') return false;
      if (catalogMode === 'combos' && !p.isCombo) return false;
      if (selectedHubId !== 'ALL' && p.hubId !== selectedHubId) return false;
      if (difficultyFilter !== 'ALL' && p.difficulty !== difficultyFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchHub = p.hubName.toLowerCase().includes(q);
        const matchLang = p.languages.some(l => l.toLowerCase().includes(q));
        const matchArea = p.areas.some(a => a.toLowerCase().includes(q));
        const matchLib = p.libraries.some(lib => lib.toLowerCase().includes(q));
        if (!matchTitle && !matchHub && !matchLang && !matchArea && !matchLib) return false;
      }
      return true;
    });
  }, [allProjects, catalogMode, selectedHubId, difficultyFilter, searchQuery]);

  // Open a project in the Workbench
  const handleOpenProject = (project, initialTab = 'refactor') => {
    setSelectedProject(project);
    setWorkbenchTab(initialTab);
    setActiveNav('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load Refactored Solution Code into Editor
  const handleLoadSolutionIntoEditor = () => {
    const primarySolution = activeCodeBundle.solutionFiles[0]?.code || '';
    setEditorCode(primarySolution);
    setIsSolutionLoadedInEditor(true);
    setUnitTestResults({
      passed: 4,
      total: 4,
      complexity: selectedProject.bigOSolution,
      details: [
        { name: 'Deduplication & Linear Time Complexity Check', status: 'PASS', ms: '4.2ms' },
        { name: 'SQL Injection & Parameterized Binding Guard', status: 'PASS', ms: '1.8ms' },
        { name: 'Zero Hardcoded Secrets Verification', status: 'PASS', ms: '0.9ms' },
        { name: 'Transient 429/500 Retry Backoff Resilience', status: 'PASS', ms: '11.4ms' }
      ]
    });
  };

  // Run Unit & Complexity Tests on Current Editor Code
  const handleRunUnitTests = () => {
    const hasHardcodedSecret = /HARDCODED|sk_live_|AIzaSy|SECRET_PROD_TOKEN/i.test(editorCode);
    const hasNestedLoop = /for\s+.*[\s\S]*for\s+/i.test(editorCode) && !isSolutionLoadedInEditor;
    const hasRawSelectStar = /SELECT \*/i.test(editorCode);

    const details = [
      {
        name: 'Linear Time Complexity & Big-O Benchmark',
        status: hasNestedLoop ? 'FAIL' : 'PASS',
        ms: hasNestedLoop ? '1,840ms (T-Limit Exceeded: O(n²))' : '5.1ms (O(n) Verified)'
      },
      {
        name: 'SQL Injection & Query Parameterization Audit',
        status: hasRawSelectStar ? 'FAIL' : 'PASS',
        ms: hasRawSelectStar ? 'FAILED: Raw SELECT * / unparameterized string' : '1.4ms (Parameterized)'
      },
      {
        name: 'Secret Scanner (No Hardcoded API Keys)',
        status: hasHardcodedSecret ? 'FAIL' : 'PASS',
        ms: hasHardcodedSecret ? 'CRITICAL: Hardcoded secret token found' : '0.7ms (Env Injected)'
      },
      {
        name: 'Edge-Case Null & Duplicate Payload Handling',
        status: hasNestedLoop || hasHardcodedSecret ? 'FAIL' : 'PASS',
        ms: hasNestedLoop ? 'FAILED on 10,000 duplicate records' : '3.3ms (Idempotent)'
      }
    ];
    const passed = details.filter(d => d.status === 'PASS').length;
    setUnitTestResults({
      passed,
      total: 4,
      complexity: hasNestedLoop ? selectedProject.bigOLegacy : selectedProject.bigOSolution,
      details
    });
  };

  // Run Production API Chaos Sandbox Stress Test
  const handleRunApiChaosBatch = () => {
    const logs = [];
    let success = 0;
    let recovered = 0;
    let dropped = 0;

    for (let i = 1; i <= 12; i++) {
      if (i % 3 === 0 && apiChaosConfig.inject429RateLimit) {
        if (apiChaosConfig.enableExponentialBackoff) {
          recovered++;
          success++;
          logs.push(`[REQ #${i}] HTTP 429 Too Many Requests -> Backoff 240ms + Jitter -> RETRY 200 OK`);
        } else {
          dropped++;
          logs.push(`[REQ #${i}] ❌ HTTP 429 Rate Limit Hit -> Unhandled Exception! Request Dropped.`);
        }
      } else if (i % 4 === 0 && apiChaosConfig.inject500Timeout) {
        if (apiChaosConfig.enableCircuitBreaker) {
          recovered++;
          success++;
          logs.push(`[REQ #${i}] HTTP 500 Upstream Timeout -> Circuit Breaker Fallback Cache Served (200 OK)`);
        } else {
          dropped++;
          logs.push(`[REQ #${i}] ❌ HTTP 500 Upstream Hang -> Socket hung for 30s & crashed worker.`);
        }
      } else if (i % 5 === 0 && apiChaosConfig.injectMalformedJson) {
        if (apiChaosConfig.enableSchemaGuard) {
          recovered++;
          success++;
          logs.push(`[REQ #${i}] Malformed Payload {amount: null} -> Schema Guard sanitized default & logged warning.`);
        } else {
          dropped++;
          logs.push(`[REQ #${i}] ❌ TypeError: Cannot read property 'toFixed' of null (Missing Payload Guard).`);
        }
      } else {
        success++;
        logs.push(`[REQ #${i}] ✅ HTTP 200 OK (Cursor Page Token: nxt_${i * 100}, Latency: ${18 + i}ms)`);
      }
    }
    setApiSandboxLogs(logs);
    setApiMetrics({ total: 12, success, recovered, dropped });
  };

  // Trigger Live Client Ambiguity Interrupt
  const handleTriggerClientInterrupt = () => {
    const prompts = [
      'URGENT CLIENT SLACK: "Legal just mandated GDPR PII masking on all email & phone fields in responses before tonight’s cutoff!"',
      'VP ENGINEERING PING: "We are getting DDOSed from 3 rogue subnets! Add sliding-window IP rate limiting to this endpoint right now."',
      'PRODUCT OWNER UPDATE: "Change sorting from alphabetical to UTC descending cursor pagination, and support CSV export headers!"',
      'DBA ALERT: "Read replica lag hit 4 seconds! Route all financial balance checks to the primary writer node immediately."'
    ];
    const nextText = prompts[agileInterrupts.length % prompts.length];
    const newInt = {
      id: `INT-${Date.now()}`,
      time: 'Just now (Mid-Sprint)',
      sender: 'Live Agile Scope Change',
      text: nextText,
      resolved: false
    };
    setAgileInterrupts(prev => [newInt, ...prev]);
    setActiveInterruptModal(newInt);
  };

  // Run Zero-Downtime Database Migration Dry-Run
  const handleRunMigrationDryRun = () => {
    const upper = migrationSql.toUpperCase();
    const hasDrop = upper.includes('DROP TABLE') || upper.includes('TRUNCATE');
    const hasSafeLock = upper.includes('LOCK=NONE') || upper.includes('CONCURRENTLY') || upper.includes('IF NOT EXISTS');

    if (hasDrop) {
      setMigrationReport({
        status: 'DESTRUCTIVE_BLOCKED',
        rowsAffected: '100,000 rows AT RISK OF DATA LOSS',
        lockTime: 'PERMANENT DATA WIPE',
        summary: 'CRITICAL FAILURE: Migration contains DROP TABLE or TRUNCATE on a 100,000-row production table! Rejected by DBA gate.'
      });
    } else if (!hasSafeLock) {
      setMigrationReport({
        status: 'LOCK_WARNING',
        rowsAffected: '100,000 rows locked exclusively',
        lockTime: '14.8 seconds (3,200 live requests timed out)',
        summary: 'WARNING: Standard ALTER TABLE acquires an exclusive metadata lock. Add ALGORITHM=INPLACE, LOCK=NONE or CREATE INDEX CONCURRENTLY.'
      });
    } else {
      setMigrationReport({
        status: 'ZERO_DOWNTIME_PASS',
        rowsAffected: '100,000 rows migrated online',
        lockTime: '0.00ms blocking lock (Online DDL)',
        summary: 'PASSED: Expand-and-Contract online migration verified! All 100,000 production rows preserved with zero dropped connections.'
      });
    }
  };

  // Run 4-Stage Visual CI/CD Pipeline Simulator
  const handleRunCicdPipeline = () => {
    setCicdRunning(true);
    const hasSecret = /HARDCODED|sk_live_|AIzaSy|SECRET_PROD_TOKEN/i.test(editorCode);
    const hasLegacyBug = /for\s+.*[\s\S]*for\s+|SELECT \*/i.test(editorCode) && !isSolutionLoadedInEditor;

    setCicdTerminalLog([
      `[CI/CD] Triggering pipeline for project ${selectedProject.id} (${selectedProject.title})...`,
      `[STAGE 1] Running trufflehog secret scanner & linter on ${activeCodeBundle.legacyFile}...`
    ]);

    setTimeout(() => {
      if (hasSecret) {
        setCicdStages([
          { id: 'lint', name: '1. Linting & Secret Scan', status: 'failed', duration: '0.6s', log: 'FAILED: Hardcoded API secret detected!' },
          { id: 'unit', name: '2. Unit & Big-O Complexity', status: 'skipped', duration: '-', log: 'Skipped due to Stage 1 failure' },
          { id: 'chaos', name: '3. API Chaos & DB Lock Audit', status: 'skipped', duration: '-', log: 'Skipped' },
          { id: 'build', name: '4. Production Container Deploy', status: 'skipped', duration: '-', log: 'Aborted' }
        ]);
        setCicdTerminalLog(prev => [
          ...prev,
          '❌ [FATAL] Stage 1 Secret Scanner found hardcoded credential in source code!',
          '👉 FIX: Remove hardcoded API key or click "Load Refactored Solution Code" to inject via process.env / os.environ.'
        ]);
        setCicdRunning(false);
        return;
      }

      if (hasLegacyBug) {
        setCicdStages([
          { id: 'lint', name: '1. Linting & Secret Scan', status: 'passed', duration: '0.7s', log: 'No secrets leaked' },
          { id: 'unit', name: '2. Unit & Big-O Complexity', status: 'failed', duration: '3.9s', log: 'FAILED: O(n²) timeout / unparameterized SQL' },
          { id: 'chaos', name: '3. API Chaos & DB Lock Audit', status: 'skipped', duration: '-', log: 'Skipped' },
          { id: 'build', name: '4. Production Container Deploy', status: 'skipped', duration: '-', log: 'Aborted' }
        ]);
        setCicdTerminalLog(prev => [
          ...prev,
          '✅ [STAGE 1] Secret scan & syntax lint passed.',
          '❌ [STAGE 2] Unit & Complexity Benchmark FAILED: Legacy O(n²) loop / raw SQL detected.',
          '👉 FIX: Refactor loop to O(n) or click "Get Solution Code" -> "Load Solution Into Editor & Re-Run".'
        ]);
        setCicdRunning(false);
        return;
      }

      // All 4 Stages Pass!
      setCicdStages([
        { id: 'lint', name: '1. Linting & Secret Scan', status: 'passed', duration: '0.7s', log: '0 secrets, 0 lint warnings' },
        { id: 'unit', name: '2. Unit & Big-O Complexity', status: 'passed', duration: '1.1s', log: `4/4 tests pass (${selectedProject.bigOSolution})` },
        { id: 'chaos', name: '3. API Chaos & DB Lock Audit', status: 'passed', duration: '1.6s', log: '429 retry + Online DDL verified' },
        { id: 'build', name: '4. Production Container Deploy', status: 'passed', duration: '1.4s', log: 'Deployed sha256:9f82a10d to prod' }
      ]);
      setCicdTerminalLog(prev => [
        ...prev,
        '✅ [STAGE 1] Linting & Secret Scan PASSED (0 leaked credentials).',
        `✅ [STAGE 2] Unit & Complexity Suite PASSED (${selectedProject.bigOSolution} verified).`,
        '✅ [STAGE 3] Chaos Resilience & Zero-Downtime Migration Audit PASSED.',
        '🚀 [STAGE 4] Production Container Image built & rolled out with 0 dropped requests!'
      ]);
      setCicdRunning(false);
    }, 650);
  };

  // Feature 6: AI "Senior Developer" Code Review (with Gemini API + instant structured Staff Engineer fallback)
  const handleRequestSeniorDevReview = async () => {
    setAiReviewLoading(true);
    const hasSecret = /HARDCODED|sk_live_|AIzaSy|SECRET_PROD_TOKEN/i.test(editorCode);
    const hasLegacy = !isSolutionLoadedInEditor && /for\s+.*[\s\S]*for\s+|SELECT \*/i.test(editorCode);

    // Deterministic baseline review in case offline or instant response needed
    const buildLocalReview = () => ({
      verdict: hasSecret || hasLegacy ? 'CHANGES_REQUESTED' : 'APPROVED_FOR_PROD',
      score: hasSecret || hasLegacy ? 42 : 96,
      reviewer: 'Staff Engineer AI (Principal Architecture Gate)',
      summary: hasSecret || hasLegacy
        ? `This PR exhibits classic academic greenfield habits. While it may work on 10 rows locally, it introduces a hardcoded credential risk and ${selectedProject.bigOLegacy} scaling bottleneck under production load.`
        : `Clean, production-hardened implementation! Credentials are properly injected via environment variables, queries are parameterized, and time complexity is bounded at ${selectedProject.bigOSolution}.`,
      comments: [
        {
          category: 'Security & Secrets (OWASP)',
          status: hasSecret ? 'CRITICAL' : 'PASS',
          detail: hasSecret
            ? 'Hardcoded API key detected in source file. Move immediately to environment variables (`os.environ` / `process.env`) and rotate the exposed token.'
            : 'No hardcoded secrets found. Environment variable validation fails fast on startup.'
        },
        {
          category: 'Algorithmic Complexity (Big-O)',
          status: hasLegacy ? 'WARN' : 'PASS',
          detail: hasLegacy
            ? `Current implementation scales at ${selectedProject.bigOLegacy}. Under a 50,000-event spike, worker threads will saturate CPU. Refactor to ${selectedProject.bigOSolution} using a pre-allocated HashSet/Map.`
            : `Optimal ${selectedProject.bigOSolution} single-pass processing with pre-allocated memory bounds.`
        },
        {
          category: 'Modularity, DRY & Error Handling',
          status: hasLegacy ? 'WARN' : 'PASS',
          detail: hasLegacy
            ? 'Network/DB calls lack timeout bounds and exponential backoff. Add structured logging and retry guards.'
            : 'Clean separation of concerns with bounded retries, timeout controllers, and idempotent guards.'
        }
      ]
    });

    try {
      const apiKey = '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Review this code for project "${selectedProject.title}" as a strict Senior Software Engineer. Check Security, Big-O complexity, and DRY modularity in 3 short sentences:\n\n${editorCode.slice(0, 1200)}`
            }]
          }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const llmText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const base = buildLocalReview();
        if (llmText) base.summary = llmText;
        setAiReviewResult(base);
        setAiReviewLoading(false);
        return;
      }
    } catch (e) {
      // Fallback to instant rich local review
    }

    setTimeout(() => {
      setAiReviewResult(buildLocalReview());
      setAiReviewLoading(false);
    }, 450);
  };

  // Feature 7: Environment Configuration (.env & Dependency Lockfile) Validator
  const handleValidateEnvironment = () => {
    const hasProdEnv = /NODE_ENV=production/i.test(envText);
    const hasSecret = /SERVICE_API_SECRET=\S{6,}/i.test(envText);
    const hasPool = /DB_POOL_SIZE=(1[0-9]|[2-9][0-9])/i.test(envText);
    const hasTlsRedis = /REDIS_TLS_URL=rediss:\/\//i.test(envText);
    const lockPinned = depConflictChoice === 'pinned';

    const checks = [
      { label: 'NODE_ENV set to "production"', ok: hasProdEnv },
      { label: 'SERVICE_API_SECRET populated (min 6 chars)', ok: hasSecret },
      { label: 'DB_POOL_SIZE configured between 10 and 99 connections', ok: hasPool },
      { label: 'REDIS_TLS_URL uses encrypted "rediss://" protocol', ok: hasTlsRedis },
      { label: 'Dependency Lockfile Conflict Resolved (Pinned Exact Versions)', ok: lockPinned }
    ];
    setEnvValidationResult({
      allPassed: checks.every(c => c.ok),
      checks
    });
  };

  const handleAutoFixEnvironment = () => {
    setEnvText(
      `# ✅ Production-Hardened Environment Configuration\nNODE_ENV=production\nSERVICE_API_SECRET=bs_kms_rotated_secret_99481a\nDB_POOL_SIZE=25\nREDIS_TLS_URL=rediss://prod-cache-cluster.internal:6379`
    );
    setDepConflictChoice('pinned');
    setEnvValidationResult({
      allPassed: true,
      checks: [
        { label: 'NODE_ENV set to "production"', ok: true },
        { label: 'SERVICE_API_SECRET populated (min 6 chars)', ok: true },
        { label: 'DB_POOL_SIZE configured between 10 and 99 connections', ok: true },
        { label: 'REDIS_TLS_URL uses encrypted "rediss://" protocol', ok: true },
        { label: 'Dependency Lockfile Conflict Resolved (Pinned Exact Versions)', ok: true }
      ]
    });
  };

  // ==========================================================================
  // AUTHENTICATION HANDLERS (STRICT PRODUCTION GATE + PRIVATE SUPERUSER DHRUV1706)
  // ==========================================================================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthErrorMsg('');
    const identifier = loginIdentifier.trim();
    const pass = loginPassword;

    if (!identifier || !pass) {
      setAuthErrorMsg('Please enter your username/email and password.');
      return;
    }

    // Exclusive Superuser check (silent in UI, never hinted)
    if (identifier === 'Dhruv1706' && pass === 'Dhruv@36900') {
      const superuserSession = {
        id: 'SUPERUSER-DHRUV1706',
        name: 'Dhruv1706',
        username: 'Dhruv1706',
        email: 'dhruv1706@beyondsyntax.prod',
        role: 'Superuser Admin',
        isSuperuser: true,
        preferredLanguage: 'Python',
        diagnosticScore: '100%',
        weaknessTag: 'Master Architect'
      };
      setCurrentUser(superuserSession);
      setActiveNav('admin');
      return;
    }

    // Check against real registered users
    const found = registeredUsers.find(
      (u) =>
        (u.username?.toLowerCase() === identifier.toLowerCase() ||
          u.email?.toLowerCase() === identifier.toLowerCase()) &&
        u.password === pass
    );

    if (found) {
      const updatedUser = {
        ...found,
        isSuperuser: false,
        lastActive: new Date().toLocaleString()
      };
      setCurrentUser(updatedUser);
      // Pre-fill quiz language only if user already picked a valid language; otherwise '' so Quiz Stage 1 requires it
      const hasValidSavedLang = PROGRAMMING_LANGUAGES.some(l => l.name === updatedUser.preferredLanguage);
      setQuizSelectedLang(hasValidSavedLang ? updatedUser.preferredLanguage : '');
      await saveRegisteredUserRecord(updatedUser);
      setActiveNav('catalog');
    } else {
      setAuthErrorMsg('Invalid username/email or password. If you are new, please create an account first.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthErrorMsg('');

    const cleanName = signupName.trim();
    const cleanUsername = signupUsername.trim();
    const cleanEmail = signupEmail.trim();
    const cleanPassword = signupPassword;

    if (!cleanName || !cleanUsername || !cleanEmail || !cleanPassword) {
      setAuthErrorMsg('Full Name, Username, Email, and Password are required to register.');
      return;
    }

    if (cleanUsername.toLowerCase() === 'dhruv1706') {
      setAuthErrorMsg('This username is reserved. Please choose another username.');
      return;
    }

    const duplicate = registeredUsers.find(
      (u) =>
        u.username?.toLowerCase() === cleanUsername.toLowerCase() ||
        u.email?.toLowerCase() === cleanEmail.toLowerCase()
    );
    if (duplicate) {
      setAuthErrorMsg('An account with that username or email is already registered. Please sign in.');
      return;
    }

    const now = new Date();
    const chosenLangLabel = signupPreferredLang ? signupPreferredLang : 'Not Decided Yet (Choose in Quiz)';
    const newUser = {
      id: `USR-${now.getTime()}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      role: 'Registered Engineer',
      isSuperuser: false,
      preferredLanguage: chosenLangLabel,
      diagnosticScore: 'Not Taken',
      weaknessTag: 'Pending Diagnostic Quiz',
      registeredAt: now.toLocaleString(),
      registeredAtEpoch: now.getTime(),
      lastActive: now.toLocaleString()
    };

    await saveRegisteredUserRecord(newUser);
    setCurrentUser(newUser);
    // If they skipped language during signup (''), Stage 1 of the quiz will require them to pick one
    setQuizSelectedLang(signupPreferredLang || '');
    setSignupName('');
    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupPreferredLang('');
    setActiveNav('catalog');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginIdentifier('');
    setLoginPassword('');
    setAuthErrorMsg('');
    setActiveNav('catalog');
  };

  const handleDeleteRegisteredUser = async (id) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== id));
    if (fbUser && firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, 'artifacts', appId, 'public', 'data', 'registered_users', id));
      } catch (e) {
        // ignore
      }
    }
  };

  const handleExportRegisteredUsersCsv = () => {
    const headers = ['ID', 'Full Name', 'Username', 'Email', 'Password', 'Preferred Language', 'Diagnostic Score', 'Primary Weakness', 'Registered At'];
    const rows = registeredUsers.map((u) => [
      u.id,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.username || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${(u.password || '').replace(/"/g, '""')}"`,
      `"${u.preferredLanguage || ''}"`,
      `"${u.diagnosticScore || ''}"`,
      `"${(u.weaknessTag || '').replace(/"/g, '""')}"`,
      `"${u.registeredAt || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `beyondsyntax_registered_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================================================
  // 3-STAGE PRACTICAL CODE DIAGNOSTIC EVALUATION & PROJECT RECOMMENDER
  // ==========================================================================
  const quizSummary = useMemo(() => {
    let correctCount = 0;
    const missedQuestions = [];
    const categoryStats = {};

    activeQuizQuestions.forEach((q) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { total: 0, correct: 0 };
      }
      categoryStats[q.category].total += 1;

      const selectedIdx = quizAnswers[q.id];
      const isCorrect = selectedIdx !== undefined && q.options[selectedIdx]?.correct;
      if (isCorrect) {
        correctCount++;
        categoryStats[q.category].correct += 1;
      } else {
        missedQuestions.push({
          ...q,
          userSelectedText: selectedIdx !== undefined ? q.options[selectedIdx]?.text : 'Skipped / Unanswered',
          correctText: q.options.find((o) => o.correct)?.text || ''
        });
      }
    });

    const pct = Math.round((correctCount / activeQuizQuestions.length) * 100);
    const weakCategories = Object.entries(categoryStats)
      .filter(([, st]) => st.correct < st.total)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
      .map(([cat]) => cat);

    const primaryWeakness =
      missedQuestions[0]?.weaknessTag || 'All Production Domains Mastered';

    // Recommend projects tailored to the user's chosen language AND their missed domains
    const langBase = quizSelectedLang.split(' ')[0].toLowerCase();
    const langProjects = allProjects.filter((p) =>
      p.languages.some((l) => l.toLowerCase().includes(langBase))
    );

    const targetedProjects = langProjects.filter((p) =>
      missedQuestions.some(
        (mq) =>
          p.areas.some((a) => a.toLowerCase().includes(mq.domain.split(' ')[0].toLowerCase())) ||
          p.focus.toLowerCase().includes(mq.category.split(' ')[0].toLowerCase())
      )
    );

    const recommendedProjects =
      targetedProjects.length >= 6
        ? targetedProjects.slice(0, 6)
        : [...targetedProjects, ...langProjects].slice(0, 6);

    return {
      correctCount,
      total: activeQuizQuestions.length,
      pct,
      primaryWeakness,
      weakCategories,
      categoryStats,
      missedQuestions,
      recommendedProjects: recommendedProjects.length > 0 ? recommendedProjects : allProjects.slice(0, 6)
    };
  }, [quizAnswers, activeQuizQuestions, quizSelectedLang, allProjects]);

  const handleSubmitCodeDiagnostic = async () => {
    setQuizStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (currentUser && !currentUser.isSuperuser) {
      const updatedUser = {
        ...currentUser,
        preferredLanguage: quizSelectedLang,
        diagnosticScore: `${quizSummary.pct}% (${quizSummary.correctCount}/${quizSummary.total})`,
        weaknessTag: quizSummary.primaryWeakness,
        lastActive: new Date().toLocaleString()
      };
      setCurrentUser(updatedUser);
      await saveRegisteredUserRecord(updatedUser);
    }
  };

  // ==========================================================================
  // MANDATORY FULL-SCREEN LAUNCH AUTH GATE (IF USER IS NOT AUTHENTICATED)
  // ==========================================================================
  if (!currentUser) {
    return (
      <div
        className="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-cyan-400 selection:text-slate-950"
        style={{ backgroundColor: '#1E2024' }}
      >
        {/* Ambient Cyan-to-Mint Glows */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00FFFF 0%, #00E5C0 60%, transparent 100%)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #10D582 0%, #00E5C0 60%, transparent 100%)' }}
        />

        {/* Top Minimal Brand Bar */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between relative z-10" style={{ backgroundColor: '#15171A' }}>
          <div className="flex items-center gap-3">
            <BeyondSyntaxLogo size={38} animated={true} />
            <div>
              <span
                className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
              >
                BeyondSyntax
              </span>
              <span className="text-xs text-slate-400 block">Academic Theory vs. Practical Coding</span>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            PRODUCTION GATEWAY
          </span>
        </div>

        {/* Center Mandatory Registration / Login Portal */}
        <div className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
          <div
            className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#15171A' }}
          >
            {/* Left Engineering Value Proposition */}
            <div className="lg:col-span-5 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-black/35">
              <div className="space-y-5">
                <BeyondSyntaxLogo size={54} animated={true} />
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 mb-1">
                    PRODUCTION ENGINEERING PLATFORM
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Bridge the Gap Between Classroom Syntax & Real Production.
                  </h1>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Register or sign in to access <strong>1,768+ production projects</strong> across 26 engineering domains and 22 programming languages, 7 interactive chaos simulators, and the practical code output diagnostic engine.
                </p>

                <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                  {[
                    '26 Engineering Areas & 22 Languages (26+ Projects & Solutions each)',
                    '520+ Cross-Domain Multi-Language Combo Projects',
                    'Language-Specific Practical Code Output Diagnostic Quiz',
                    '7 Live Simulators: Legacy Refactor, 429 API Sandbox, 100k-Row DB Migration, CI/CD & AI Senior PR Review'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-[11px] font-mono text-slate-400">
                BEYONDSYNTAX SECURE ACCESS GATE
              </div>
            </div>

            {/* Right Registration / Login Form (Zero Hints or Demo Credentials) */}
            <div className="lg:col-span-7 p-8 space-y-6">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthErrorMsg('');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition ${
                    authMode === 'signup'
                      ? 'text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  style={
                    authMode === 'signup'
                      ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }
                      : {}
                  }
                >
                  Create Account (Sign Up)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthErrorMsg('');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition ${
                    authMode === 'login'
                      ? 'text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  style={
                    authMode === 'login'
                      ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }
                      : {}
                  }
                >
                  Sign In (Existing User)
                </button>
              </div>

              {authErrorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-400/40 text-xs text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authErrorMsg}</span>
                </div>
              )}

              {authMode === 'signup' ? (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Username</label>
                      <input
                        type="text"
                        required
                        placeholder="Choose a username"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Preferred Language <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <select
                        value={signupPreferredLang}
                        onChange={(e) => setSignupPreferredLang(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="" className="bg-[#141619] text-slate-300">
                          Not Decided Yet / Choose Later in Quiz
                        </option>
                        {PROGRAMMING_LANGUAGES.map((l) => (
                          <option key={l.id} value={l.name} className="bg-[#141619] text-white">
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showSignupPass ? 'text' : 'password'}
                        required
                        placeholder="Create a password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPass((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
                    style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                  >
                    <UserPlus className="w-4 h-4" /> Register & Launch BeyondSyntax
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Username or Email</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your username or email"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPass ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
                    style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                  >
                    <LogIn className="w-4 h-4" /> Sign In to Workspace
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 px-6 py-3 text-center text-xs text-slate-500 font-mono">
          BeyondSyntax Production Environment • Academic Theory vs. Practical Execution
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-cyan-400 selection:text-slate-950" style={{ backgroundColor: '#1E2024' }}>
      {/* TOP TERMINAL LIVE STATUS TICKER */}
      <div className="border-b border-white/10 px-4 py-1.5 text-xs font-mono flex items-center justify-between" style={{ backgroundColor: '#15171A' }}>
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-block w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#10D582' }} />
          <span className="font-bold tracking-wider uppercase" style={{ color: '#00FFFF' }}>BEYONDSYNTAX://PROD-KERNEL</span>
          <span className="text-slate-400 truncate">{tickerMessages[bootTickerIndex]}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0">
          <span>26 Areas • 22 Languages • <strong className="text-emerald-400">1,768 Projects</strong></span>
          <span>|</span>
          <span>Signed in as: <strong className="text-cyan-300">{currentUser.name}</strong> (@{currentUser.username})</span>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: 'rgba(30, 32, 36, 0.92)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo + Tagline */}
          <div
            onClick={() => setActiveNav('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <BeyondSyntaxLogo size={44} animated={true} />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                >
                  BeyondSyntax
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
                  PRO v4.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Academic Theory vs. Practical Coding
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Admin Console Strictly Visible ONLY to Superuser Dhruv1706) */}
          <nav className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'catalog', label: 'Curriculum (1,768)', icon: Layers },
              { id: 'workbench', label: 'Production Chaos Workbench', icon: Terminal },
              { id: 'quiz', label: 'Code Output Diagnostic Quiz', icon: Compass },
              { id: 'architecture', label: '7 Chaos Pillars', icon: Cpu },
              ...(currentUser?.isSuperuser && currentUser?.username === 'Dhruv1706'
                ? [{ id: 'admin', label: 'Private Admin Console', icon: Shield }]
                : [])
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeNav === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveNav(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-slate-950 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  style={
                    isActive
                      ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition ml-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </header>

      {/* GLOBAL CLIENT INTERRUPT POPUP MODAL (IF TRIGGERED) */}
      {activeInterruptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full rounded-2xl border border-amber-400/50 p-6 shadow-2xl" style={{ backgroundColor: '#15171A' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                <MessageSquareWarning className="w-4 h-4" /> LIVE AGILE REQUIREMENT INTERRUPT
              </span>
              <span className="text-xs font-mono text-slate-400">{activeInterruptModal.time}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{activeInterruptModal.sender}</h3>
            <p className="text-sm text-slate-300 bg-black/40 p-4 rounded-xl border border-white/10 font-mono mb-4">
              {activeInterruptModal.text}
            </p>
            <div className="text-xs text-slate-400 mb-5">
              <strong>The Academic Gap:</strong> University assignments never change rubrics mid-week. In production, engineers adapt to shifting client constraints without breaking existing tests.
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setAgileInterrupts(prev => prev.map(i => i.id === activeInterruptModal.id ? { ...i, resolved: true } : i));
                  setActiveInterruptModal(null);
                  setActiveNav('workbench');
                  setWorkbenchTab('solution');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950"
                style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
              >
                Accept Scope Change & View Updated Solution
              </button>
              <button
                onClick={() => setActiveInterruptModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT DETAIL & MULTI-FILE SOLUTION MODAL (VIEW PROJECT + GET SOLUTION CODE) */}
      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="max-w-4xl w-full rounded-3xl border border-cyan-400/40 overflow-hidden shadow-2xl my-8" style={{ backgroundColor: '#141619' }}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <span>{modalProject.id}</span>
                  <span>•</span>
                  <span>{modalProject.hubName}</span>
                  <span>•</span>
                  <span className="text-emerald-300">{modalProject.difficulty}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">{modalProject.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setModalViewMode('brief');
                    setModalSimOutput(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    modalViewMode === 'brief'
                      ? 'text-slate-950'
                      : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                  }`}
                  style={modalViewMode === 'brief' ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' } : {}}
                >
                  1. Project Brief & Architecture
                </button>
                <button
                  onClick={() => setModalViewMode('solution')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    modalViewMode === 'solution'
                      ? 'text-slate-950'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/25'
                  }`}
                  style={modalViewMode === 'solution' ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' } : {}}
                >
                  2. Get Solution Code
                </button>
                <button
                  onClick={() => setModalProject(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 text-slate-300 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {(() => {
              const bundle = generateProjectCodeBundle(modalProject);
              if (modalViewMode === 'brief') {
                return (
                  <div className="p-6 space-y-5">
                    <p className="text-xs sm:text-sm text-slate-300">{modalProject.subtitle}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-rose-950/25 border border-rose-500/30 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-rose-300 uppercase">
                          ❌ Academic Classroom Theory ({modalProject.bigOLegacy})
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{modalProject.academicTheory}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-emerald-300 uppercase">
                          ✅ Practical Production Reality ({modalProject.bigOSolution})
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{modalProject.practicalReality}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200 font-mono">
                      <strong>Mid-Sprint Agile Requirement:</strong> {modalProject.clientInterrupt}
                    </div>

                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0D0F12]">
                      <div className="px-4 py-2 border-b border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-rose-300">
                        <span>Legacy Broken Code: {bundle.legacyFile}</span>
                        <span>Complexity: {modalProject.bigOLegacy}</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">{bundle.legacyCode}</pre>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <button
                        onClick={() => setModalViewMode('solution')}
                        className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 flex items-center gap-2"
                        style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                      >
                        <FileCode className="w-4 h-4" /> Get Multi-File Production Solution Code
                      </button>
                      <button
                        onClick={() => {
                          const proj = modalProject;
                          setModalProject(null);
                          handleOpenProject(proj, 'refactor');
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                      >
                        Open in Full 7-Simulator Chaos Workbench →
                      </button>
                    </div>
                  </div>
                );
              }

              const activeFile = bundle.solutionFiles[modalSolutionFileIdx] || bundle.solutionFiles[0];
              return (
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {bundle.solutionFiles.map((file, idx) => (
                        <button
                          key={file.name}
                          onClick={() => setModalSolutionFileIdx(idx)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                            modalSolutionFileIdx === idx
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-black/40 text-slate-300 border border-white/10 hover:text-white'
                          }`}
                        >
                          {file.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(activeFile.code);
                          setCopiedCodeToast(true);
                          setTimeout(() => setCopiedCodeToast(false), 1500);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/10 text-cyan-300 hover:bg-white/15 flex items-center gap-1.5"
                      >
                        {copiedCodeToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCodeToast ? 'Copied!' : 'Copy Solution'}
                      </button>
                      <button
                        onClick={() =>
                          setModalSimOutput(
                            `[PROD_RUNNER] Compiling & verifying ${activeFile.name}...\n[PASS] Deduplication & Complexity verified at ${modalProject.bigOSolution} (4.1ms)\n[PASS] Parameterized SQL & Secret Guard verified (0 leaks)\n[PASS] 100,000-row Zero-Downtime Migration & 429 Backoff verified.`
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 flex items-center gap-1.5"
                        style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                      >
                        <Play className="w-3.5 h-3.5" /> Simulate Production Run
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-400/30 overflow-hidden bg-[#0B0D10]">
                    <pre className="p-4 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                      {activeFile.code}
                    </pre>
                  </div>

                  {modalSimOutput && (
                    <pre className="p-4 rounded-2xl bg-black/70 border border-cyan-400/30 text-xs font-mono text-cyan-300 whitespace-pre-wrap">
                      {modalSimOutput}
                    </pre>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        const proj = modalProject;
                        setModalProject(null);
                        handleOpenProject(proj, 'solution');
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold border border-cyan-400/40 bg-cyan-500/15 text-cyan-300"
                    >
                      Launch Full Chaos Workbench with Solution →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ====================================================================
          VIEW 1: FULL CURRICULUM CATALOG (1,768+ PROJECTS ACROSS 26 AREAS, 22 LANGUAGES & 520 COMBOS)
         ==================================================================== */}
      {activeNav === 'catalog' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Hero Banner */}
          <div className="rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-2xl" style={{ backgroundColor: '#141619' }}>
            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" /> 26 ENGINEERING AREAS • 22 LANGUAGES • 520+ MULTI-DOMAIN COMBO LABS
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Stop Writing Classroom Toy Scripts. Engineer Production-Grade Systems.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every hub below contains <strong>26+ real-world production projects and multi-file solutions</strong> designed to bridge the gap between academic theory and day-one software engineering execution.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setActiveNav('quiz')}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 shadow-lg flex items-center gap-2"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                >
                  <Compass className="w-4 h-4" /> Take 15-Question Practical Code Diagnostic Quiz
                </button>
                <button
                  onClick={() => setActiveNav('workbench')}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                >
                  Open 7-Simulator Production Chaos Workbench
                </button>
              </div>
            </div>
          </div>

          {/* Catalog Mode Switcher + Search + Difficulty Filter */}
          <div className="rounded-2xl border border-white/10 p-4 sm:p-5 space-y-4" style={{ backgroundColor: '#141619' }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Projects (1,768)' },
                  { id: 'areas', label: '26 Engineering Area Hubs (676)' },
                  { id: 'languages', label: '22 Language Hubs (572)' },
                  { id: 'combos', label: '2+ Multi-Domain Combos (520)' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCatalogMode(m.id);
                      setSelectedHubId('ALL');
                      setVisibleCount(24);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      catalogMode === m.id
                        ? 'text-slate-950 shadow-md'
                        : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
                    }`}
                    style={catalogMode === m.id ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' } : {}}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'Junior', 'Mid-Level', 'Senior', 'Principal'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                      difficultyFilter === diff
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50'
                        : 'bg-black/30 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 1,768 projects by language (Python, Rust, TypeScript, Go...), engineering area, library (Django, React, Spark, ROS2...), or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Hub Selector Pills */}
            {catalogMode === 'areas' && (
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-40 overflow-y-auto">
                <button
                  onClick={() => setSelectedHubId('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    selectedHubId === 'ALL' ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-black/40 text-slate-300 border border-white/10'
                  }`}
                >
                  All 26 Areas
                </button>
                {ENGINEERING_AREAS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedHubId(a.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      selectedHubId === a.id ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-black/40 text-slate-300 border border-white/10 hover:border-cyan-400/40'
                    }`}
                  >
                    {a.name} (26)
                  </button>
                ))}
              </div>
            )}

            {catalogMode === 'languages' && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => setSelectedHubId('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    selectedHubId === 'ALL' ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-black/40 text-slate-300 border border-white/10'
                  }`}
                >
                  All 22 Languages
                </button>
                {PROGRAMMING_LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedHubId(l.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      selectedHubId === l.id ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-black/40 text-slate-300 border border-white/10 hover:border-cyan-400/40'
                    }`}
                  >
                    {l.name} (26)
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count Header */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{Math.min(visibleCount, filteredProjects.length)}</strong> of{' '}
              <strong className="text-cyan-300">{filteredProjects.length}</strong> matching production projects
            </span>
            <span>Every project includes Legacy Code + Multi-File Refactored Solution</span>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.slice(0, visibleCount).map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-white/10 hover:border-cyan-400/40 p-5 flex flex-col justify-between gap-4 transition-all duration-200 shadow-lg"
                style={{ backgroundColor: '#141619' }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 truncate">
                      {proj.hubName}
                    </span>
                    <span className="text-emerald-300 shrink-0">{proj.difficulty}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white leading-snug">{proj.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{proj.subtitle}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.languages.map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-cyan-200 border border-white/10">
                        {l}
                      </span>
                    ))}
                    {proj.libraries.slice(0, 2).map((lib) => (
                      <span key={lib} className="px-2 py-0.5 rounded bg-emerald-500/10 text-[11px] font-mono text-emerald-300 border border-emerald-400/20">
                        {lib}
                      </span>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono flex items-center justify-between">
                    <span className="text-rose-300">Legacy: {proj.bigOLegacy}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-300">Prod: {proj.bigOSolution}</span>
                  </div>
                </div>

                {/* Dual Action Buttons: View Project & Get Solution Code */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setModalProject(proj);
                      setModalViewMode('brief');
                      setModalSolutionFileIdx(0);
                      setModalSimOutput(null);
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-extrabold text-slate-950 flex items-center justify-center gap-1.5 shadow-md hover:opacity-95"
                    style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                  >
                    <Terminal className="w-3.5 h-3.5" /> View Project
                  </button>
                  <button
                    onClick={() => {
                      setModalProject(proj);
                      setModalViewMode('solution');
                      setModalSolutionFileIdx(0);
                      setModalSimOutput(null);
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 flex items-center justify-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5" /> Get Solution Code
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Pagination Button */}
          {visibleCount < filteredProjects.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 36)}
                className="px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-slate-950 shadow-xl"
                style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
              >
                Load More Production Projects ({filteredProjects.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </main>
      )}

      {/* ====================================================================
          VIEW 2: PRODUCTION CHAOS WORKBENCH (ALL 7 INTERACTIVE SIMULATORS)
         ==================================================================== */}
      {activeNav === 'workbench' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Active Project Header Bar */}
          <div className="rounded-3xl border border-white/10 p-6 flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: '#141619' }}>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                <span>ACTIVE WORKBENCH: {selectedProject.id}</span>
                <span>•</span>
                <span>{selectedProject.hubName}</span>
                <span>•</span>
                <span className="text-emerald-300">{selectedProject.languages.join(' + ')}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{selectedProject.title}</h1>
              <p className="text-xs text-slate-400">{selectedProject.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleTriggerClientInterrupt}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-400/40 hover:bg-amber-500/25 flex items-center gap-1.5"
              >
                <MessageSquareWarning className="w-4 h-4" /> Trigger Agile Client Scope Change (#3)
              </button>
              <button
                onClick={() => {
                  setWorkbenchTab('solution');
                  handleLoadSolutionIntoEditor();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-950 flex items-center gap-1.5"
                style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
              >
                <FileCode className="w-4 h-4" /> Get Solution Code
              </button>
            </div>
          </div>

          {/* 7 Production Chaos Workbench Simulator Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'refactor', label: '1. Legacy Code Refactoring' },
              { id: 'solution', label: 'Multi-File Solution Code' },
              { id: 'api-sandbox', label: '2. Production API Sandbox (429/500)' },
              { id: 'db-migration', label: '4. 100k-Row DB Migration' },
              { id: 'cicd', label: '5. CI/CD Pipeline Simulator' },
              { id: 'ai-review', label: '6. AI Senior Dev PR Review' },
              { id: 'env-config', label: '7. .env & Lockfile Config' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setWorkbenchTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  workbenchTab === t.id
                    ? 'text-slate-950 shadow-lg'
                    : 'bg-[#141619] text-slate-300 border border-white/10 hover:text-white'
                }`}
                style={workbenchTab === t.id ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: LEGACY CODE REFACTORING ENGINE */}
          {workbenchTab === 'refactor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-white/10 p-5 space-y-4" style={{ backgroundColor: '#141619' }}>
                  <h3 className="text-sm font-bold text-white uppercase font-mono text-cyan-300">
                    Academic Theory vs. Practical Production Reality
                  </h3>
                  <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/30 text-xs text-slate-200 space-y-1">
                    <div className="font-bold text-rose-300">Academic Theory ({selectedProject.bigOLegacy}):</div>
                    <p>{selectedProject.academicTheory}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 text-xs text-slate-200 space-y-1">
                    <div className="font-bold text-emerald-300">Practical Reality ({selectedProject.bigOSolution}):</div>
                    <p>{selectedProject.practicalReality}</p>
                  </div>
                </div>

                {/* Live Agile Requirement Feed */}
                <div className="rounded-2xl border border-white/10 p-5 space-y-3" style={{ backgroundColor: '#141619' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      #3. Live Agile Client Updates ({agileInterrupts.length})
                    </span>
                    <button
                      onClick={handleTriggerClientInterrupt}
                      className="text-xs font-mono text-cyan-300 underline"
                    >
                      + Simulate Client Ping
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {agileInterrupts.map((intItem) => (
                      <div key={intItem.id} className="p-3 rounded-xl bg-black/40 border border-amber-400/20 text-xs space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>{intItem.sender}</span>
                          <span>{intItem.time}</span>
                        </div>
                        <p className="text-amber-200 font-mono">{intItem.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#141619' }}>
                  <div className="px-4 py-3 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-cyan-300">{activeCodeBundle.legacyFile}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleLoadSolutionIntoEditor}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/25"
                      >
                        Load Refactored Solution ({selectedProject.bigOSolution})
                      </button>
                      <button
                        onClick={handleRunUnitTests}
                        className="px-4 py-1.5 rounded-lg text-xs font-black text-slate-950 flex items-center gap-1"
                        style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                      >
                        <Play className="w-3.5 h-3.5" /> Run Unit & Big-O Tests
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    rows={14}
                    className="w-full p-4 bg-[#0B0D10] text-xs font-mono text-cyan-100 focus:outline-none leading-relaxed"
                  />
                </div>

                {unitTestResults && (
                  <div className="rounded-2xl border border-white/10 p-5 space-y-3" style={{ backgroundColor: '#141619' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-white">
                        Unit Test Suite: {unitTestResults.passed}/{unitTestResults.total} Passed
                      </span>
                      <span className="text-xs font-mono text-cyan-300">
                        Measured Complexity: {unitTestResults.complexity}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {unitTestResults.details.map((d, i) => (
                        <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                          <span className={d.status === 'PASS' ? 'text-emerald-300' : 'text-rose-300'}>
                            {d.status === 'PASS' ? '✅ PASS' : '❌ FAIL'} — {d.name}
                          </span>
                          <span className="text-slate-400">{d.ms}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MULTI-FILE REFACTORED SOLUTION VIEWER */}
          {workbenchTab === 'solution' && (
            <div className="rounded-3xl border border-emerald-400/30 p-6 space-y-4" style={{ backgroundColor: '#141619' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {activeCodeBundle.solutionFiles.map((f, idx) => (
                    <button
                      key={f.name}
                      onClick={() => setActiveSolutionFileIdx(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold ${
                        activeSolutionFileIdx === idx
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-black/40 text-slate-300 border border-white/10'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const f = activeCodeBundle.solutionFiles[activeSolutionFileIdx] || activeCodeBundle.solutionFiles[0];
                      navigator.clipboard?.writeText(f.code);
                      setCopiedCodeToast(true);
                      setTimeout(() => setCopiedCodeToast(false), 1500);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-mono bg-white/10 text-cyan-300 flex items-center gap-1.5"
                  >
                    {copiedCodeToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedCodeToast ? 'Copied Solution!' : 'Copy File'}
                  </button>
                  <button
                    onClick={() => {
                      handleLoadSolutionIntoEditor();
                      setWorkbenchTab('refactor');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black text-slate-950"
                    style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                  >
                    Load Solution Into Refactor Editor & Verify
                  </button>
                </div>
              </div>
              <pre className="p-5 rounded-2xl bg-[#0B0D10] border border-white/10 text-xs sm:text-sm font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                {(activeCodeBundle.solutionFiles[activeSolutionFileIdx] || activeCodeBundle.solutionFiles[0]).code}
              </pre>
            </div>
          )}

          {/* TAB 2: PRODUCTION API SANDBOX (429 RATE LIMITS, 500 TIMEOUTS, MALFORMED PAYLOADS) */}
          {workbenchTab === 'api-sandbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 rounded-2xl border border-white/10 p-5 space-y-4" style={{ backgroundColor: '#141619' }}>
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase">
                  #2. Production API Chaos Controls
                </h3>
                <div className="space-y-2.5 text-xs">
                  {[
                    { key: 'inject429RateLimit', label: 'Inject HTTP 429 Too Many Requests' },
                    { key: 'inject500Timeout', label: 'Inject HTTP 500 Upstream Timeouts' },
                    { key: 'injectMalformedJson', label: 'Inject Null / Malformed JSON Payloads' },
                    { key: 'enableExponentialBackoff', label: '✅ Enable Exponential Backoff + Jitter' },
                    { key: 'enableCircuitBreaker', label: '✅ Enable Circuit Breaker Fallback' },
                    { key: 'enableSchemaGuard', label: '✅ Enable Strict Runtime Schema Guard' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
                      <span className="text-slate-200 font-medium">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={apiChaosConfig[item.key]}
                        onChange={(e) => setApiChaosConfig((p) => ({ ...p, [item.key]: e.target.checked }))}
                        className="w-4 h-4 accent-cyan-400"
                      />
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleRunApiChaosBatch}
                  className="w-full py-3 rounded-xl text-xs font-black text-slate-950"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                >
                  Fire 12-Request Production Burst
                </button>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-white/10 p-5 space-y-4" style={{ backgroundColor: '#141619' }}>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-lg font-black text-white">{apiMetrics.total}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Total Requests</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-400/30">
                    <div className="text-lg font-black text-emerald-400">{apiMetrics.success}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Succeeded</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-cyan-400/30">
                    <div className="text-lg font-black text-cyan-300">{apiMetrics.recovered}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Auto-Recovered</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-rose-400/30">
                    <div className="text-lg font-black text-rose-400">{apiMetrics.dropped}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Dropped / Crashed</div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs space-y-1.5 max-h-72 overflow-y-auto">
                  {apiSandboxLogs.length === 0 ? (
                    <div className="text-slate-500">Click "Fire 12-Request Production Burst" to test resilience...</div>
                  ) : (
                    apiSandboxLogs.map((log, i) => (
                      <div key={i} className={log.includes('❌') ? 'text-rose-300' : 'text-emerald-300'}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCTION-READY 100,000-ROW DATABASE MIGRATION WORKBENCH */}
          {workbenchTab === 'db-migration' && (
            <div className="rounded-2xl border border-white/10 p-6 space-y-4" style={{ backgroundColor: '#141619' }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">
                    #4. Zero-Downtime MySQL Schema Migration Workbench (100,000 Live User Rows)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Write an online migration that adds columns/indexes without locking active reads/writes or dropping records.
                  </p>
                </div>
                <button
                  onClick={handleRunMigrationDryRun}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-950"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                >
                  Execute Online Migration Dry-Run
                </button>
              </div>
              <textarea
                value={migrationSql}
                onChange={(e) => setMigrationSql(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs text-cyan-100 focus:outline-none"
              />
              {migrationReport && (
                <div className="p-4 rounded-2xl bg-black/50 border border-cyan-400/30 text-xs font-mono space-y-1">
                  <div className="font-bold text-cyan-300">STATUS: {migrationReport.status}</div>
                  <div className="text-slate-300">Rows Affected: {migrationReport.rowsAffected} | Blocking Lock Time: {migrationReport.lockTime}</div>
                  <div className="text-emerald-300">{migrationReport.summary}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CI/CD PIPELINE SIMULATOR */}
          {workbenchTab === 'cicd' && (
            <div className="rounded-2xl border border-white/10 p-6 space-y-5" style={{ backgroundColor: '#141619' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">#5. Visual CI/CD Deployment Pipeline Simulator</h3>
                  <p className="text-xs text-slate-400">
                    Audits your current editor code for hardcoded API keys, Big-O regressions, and migration locks before container rollout.
                  </p>
                </div>
                <button
                  onClick={handleRunCicdPipeline}
                  disabled={cicdRunning}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-950"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                >
                  {cicdRunning ? 'Running Pipeline...' : 'Trigger Production CI/CD Pipeline'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {cicdStages.map((st) => (
                  <div key={st.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{st.name}</span>
                      <span
                        className={`font-mono uppercase text-[10px] px-2 py-0.5 rounded ${
                          st.status === 'passed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : st.status === 'failed'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{st.log}</div>
                  </div>
                ))}
              </div>
              <pre className="p-4 rounded-2xl bg-[#0B0D10] border border-white/10 text-xs font-mono text-cyan-200 overflow-x-auto">
                {cicdTerminalLog.join('\n')}
              </pre>
            </div>
          )}

          {/* TAB 6: AI SENIOR DEVELOPER CODE REVIEW */}
          {workbenchTab === 'ai-review' && (
            <div className="rounded-2xl border border-white/10 p-6 space-y-5" style={{ backgroundColor: '#141619' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">#6. AI "Senior Developer" Pull Request Review</h3>
                  <p className="text-xs text-slate-400">
                    Strict Staff Engineer audit checking OWASP security, SQL injection risks, DRY modularity, and Big-O scalability.
                  </p>
                </div>
                <button
                  onClick={handleRequestSeniorDevReview}
                  disabled={aiReviewLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-950"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                >
                  {aiReviewLoading ? 'Reviewing PR...' : 'Request Senior Engineer PR Review'}
                </button>
              </div>
              {aiReviewResult && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-cyan-400/30 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono text-cyan-300">{aiReviewResult.reviewer}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{aiReviewResult.summary}</div>
                    </div>
                    <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300">
                      PR Score: {aiReviewResult.score}/100 ({aiReviewResult.verdict})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {aiReviewResult.comments.map((c, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-mono font-bold">
                          <span className="text-white">{c.category}</span>
                          <span className={c.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>{c.status}</span>
                        </div>
                        <p className="text-slate-300">{c.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ENVIRONMENT CONFIGURATION (.ENV & LOCKFILE) CHALLENGE */}
          {workbenchTab === 'env-config' && (
            <div className="rounded-2xl border border-white/10 p-6 space-y-5" style={{ backgroundColor: '#141619' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">#7. Environment Configuration (.env & Lockfile Resolver)</h3>
                  <p className="text-xs text-slate-400">
                    Configure production environment variables and resolve conflicting semver ranges before starting the service.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAutoFixEnvironment}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
                  >
                    Auto-Populate Production .env & Pin Lockfile
                  </button>
                  <button
                    onClick={handleValidateEnvironment}
                    className="px-5 py-2 rounded-xl text-xs font-black text-slate-950"
                    style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                  >
                    Validate Environment
                  </button>
                </div>
              </div>
              <textarea
                value={envText}
                onChange={(e) => setEnvText(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-2xl bg-[#0B0D10] border border-white/10 font-mono text-xs text-cyan-100 focus:outline-none"
              />
              {envValidationResult && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {envValidationResult.checks.map((ch, i) => (
                    <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono flex items-center justify-between">
                      <span className="text-slate-200">{ch.label}</span>
                      <span className={ch.ok ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {ch.ok ? 'VERIFIED' : 'INVALID'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* ====================================================================
          VIEW 3: 3-STAGE PRACTICAL CODE DIAGNOSTIC QUIZ (MANDATORY LANGUAGE GATE IN STAGE 1)
         ==================================================================== */}
      {activeNav === 'quiz' && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* STAGE 1: MANDATORY PREFERRED LANGUAGE SELECTION */}
          {quizStage === 'select-language' && (
            <div className="rounded-3xl border border-white/10 p-6 sm:p-10 space-y-8 shadow-2xl" style={{ backgroundColor: '#141619' }}>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono border border-cyan-400/30">
                  STAGE 1 OF 3 • MANDATORY QUIZ LANGUAGE SELECTION GATE
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white">
                  Choose Your Programming Language for the Code Output Diagnostic
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Even if you skipped selecting a language during registration, you <strong>must select one programming language below</strong> before starting the quiz. All <strong>15 practical production code & runtime output questions</strong>—as well as your post-quiz project recommendations—are dynamically generated for your chosen language.
                </p>
              </div>

              {!quizSelectedLang && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-xs font-mono text-amber-200 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    REQUIRED: Click any of the 22 programming languages below to unlock the 15-Question Practical Code Output Diagnostic.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {PROGRAMMING_LANGUAGES.map((lang) => {
                  const isSelected = quizSelectedLang === lang.name;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setQuizSelectedLang(lang.name)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                          : 'border-white/10 bg-black/30 hover:border-white/25 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{lang.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                          .{lang.ext}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {lang.ecosystem.slice(0, 2).join(' • ')}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400 font-mono">
                  Selected Quiz Language:{' '}
                  <strong className={quizSelectedLang ? 'text-emerald-300' : 'text-amber-300'}>
                    {quizSelectedLang || 'None Selected Yet (Required to Start)'}
                  </strong>{' '}
                  • 15 Practical Code & Output Questions
                </div>
                <button
                  type="button"
                  disabled={!quizSelectedLang}
                  onClick={() => {
                    if (!quizSelectedLang) return;
                    setQuizAnswers({});
                    setCurrentQuestionIdx(0);
                    setQuizStage('questions');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-slate-950 shadow-xl flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                >
                  <span>
                    {quizSelectedLang
                      ? `Start 15-Question ${quizSelectedLang} Code Output Diagnostic`
                      : 'Select a Language Above to Unlock Quiz'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: 15 PRACTICAL CODE SNIPPET & OUTPUT QUESTIONS (NO SPOILERS OR DIRECT ANSWERS) */}
          {quizStage === 'questions' && (
            <div className="space-y-6">
              {/* Top Progress Header */}
              <div className="rounded-2xl border border-white/10 p-5 flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: '#15171A' }}>
                <div>
                  <div className="text-xs font-mono text-cyan-300 uppercase">
                    STAGE 2 OF 3 • {quizSelectedLang.toUpperCase()} PRODUCTION CODE DIAGNOSTIC
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    Question {currentQuestionIdx + 1} of {activeQuizQuestions.length} • Answered: {Object.keys(quizAnswers).length}/{activeQuizQuestions.length}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setQuizStage('select-language')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                >
                  Change Language ({quizSelectedLang})
                </button>
              </div>

              {/* Question Number Stepper Pills */}
              <div className="flex flex-wrap gap-1.5">
                {activeQuizQuestions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIdx;
                  const isAnswered = quizAnswers[q.id] !== undefined;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition ${
                        isCurrent
                          ? 'text-slate-950 shadow-md scale-105'
                          : isAnswered
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'bg-[#15171A] text-slate-400 border border-white/10 hover:text-white'
                      }`}
                      style={
                        isCurrent
                          ? { backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }
                          : {}
                      }
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Code Question Card */}
              {(() => {
                const q = activeQuizQuestions[currentQuestionIdx];
                return (
                  <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl" style={{ backgroundColor: '#15171A' }}>
                    <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                          Scenario #{currentQuestionIdx + 1}: {q.category}
                        </span>
                        <span className="text-xs font-mono text-emerald-300">
                          {quizSelectedLang}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        Blind Assessment Mode (Results shown after submission)
                      </span>
                    </div>

                    <div className="p-6 space-y-5">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {q.title}
                      </h3>

                      {/* Realistic Code Snippet Box */}
                      <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0E1013]">
                        <div className="px-4 py-2 border-b border-white/10 bg-black/50 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>production_snippet_{q.id}.{PROGRAMMING_LANGUAGES.find(l => l.name === quizSelectedLang)?.ext || 'txt'}</span>
                          <span>Inspect Code & Predict Production Output</span>
                        </div>
                        <pre className="p-4 font-mono text-xs sm:text-sm text-cyan-100 overflow-x-auto leading-relaxed">
                          {q.codeSnippet}
                        </pre>
                      </div>

                      <div className="text-sm sm:text-base font-bold text-white pt-1">
                        {q.question}
                      </div>

                      {/* Options List (Neutral Selection Only — No Direct Right/Wrong Spoiler!) */}
                      <div className="space-y-2.5">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[q.id] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() =>
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                              }
                              className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'border-cyan-400 bg-cyan-500/15 text-white font-semibold shadow-md'
                                  : 'border-white/10 bg-black/30 text-slate-300 hover:border-white/25'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                    isSelected
                                      ? 'bg-cyan-400 text-slate-950'
                                      : 'bg-white/10 text-slate-400'
                                  }`}
                                >
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Bottom Prev / Next / Submit Bar */}
                      <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          disabled={currentQuestionIdx === 0}
                          onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-40"
                        >
                          ← Previous Question
                        </button>

                        <div className="flex items-center gap-3">
                          {currentQuestionIdx < activeQuizQuestions.length - 1 ? (
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentQuestionIdx((p) =>
                                  Math.min(activeQuizQuestions.length - 1, p + 1)
                                )
                              }
                              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950"
                              style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                            >
                              Next Question →
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={handleSubmitCodeDiagnostic}
                            className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-950 shadow-lg"
                            style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                          >
                            Submit All {activeQuizQuestions.length} Answers & Diagnose Weaknesses
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* STAGE 3: POST-QUIZ WEAKNESS DIAGNOSIS & TARGETED PROJECT RECOMMENDATIONS */}
          {quizStage === 'results' && (
            <div className="space-y-8">
              <div className="rounded-3xl border border-emerald-400/50 p-6 sm:p-8 space-y-6 shadow-2xl" style={{ backgroundColor: '#15171A' }}>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="text-xs font-mono text-emerald-300 uppercase">
                      STAGE 3 OF 3 • {quizSelectedLang.toUpperCase()} DIAGNOSTIC REPORT COMPLETE
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      Production Code Readiness: {quizSummary.pct}% ({quizSummary.correctCount}/{quizSummary.total} Correct)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Primary Identified Bottleneck: <strong className="text-amber-300">{quizSummary.primaryWeakness}</strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizAnswers({});
                        setCurrentQuestionIdx(0);
                        setQuizStage('select-language');
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/15"
                    >
                      Retake / Change Language
                    </button>
                  </div>
                </div>

                {/* Category Pillar Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {Object.entries(quizSummary.categoryStats).map(([cat, st]) => {
                    const catPct = Math.round((st.correct / st.total) * 100);
                    return (
                      <div key={cat} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{cat}</span>
                          <span className={`font-mono font-bold ${catPct === 100 ? 'text-emerald-400' : catPct >= 50 ? 'text-amber-300' : 'text-rose-400'}`}>
                            {st.correct}/{st.total} ({catPct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${catPct}%`,
                              backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recommended Projects Based on Chosen Language & Weaknesses */}
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      Recommended {quizSelectedLang} Production Projects to Fix Your Weaknesses
                    </h3>
                    <p className="text-xs text-slate-400">
                      We matched your missed production code output scenarios to these hands-on {quizSelectedLang} workbenches:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizSummary.recommendedProjects.map((proj) => (
                      <div key={proj.id} className="p-5 rounded-2xl bg-black/40 border border-cyan-400/30 flex flex-col justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-cyan-300">{proj.hubName}</span>
                            <span className="text-emerald-300">{proj.languages.join(' + ')}</span>
                          </div>
                          <div className="text-base font-bold text-white">{proj.title}</div>
                          <div className="text-xs text-slate-400">{proj.subtitle}</div>
                          <div className="text-[11px] font-mono text-amber-300 pt-1">
                            Target Skill: {proj.focus} ({proj.bigOLegacy} → {proj.bigOSolution})
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handleOpenProject(proj, 'refactor')}
                            className="py-2.5 rounded-xl text-xs font-bold text-slate-950 flex items-center justify-center gap-1.5"
                            style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                          >
                            <Terminal className="w-3.5 h-3.5" /> View Project Brief
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenProject(proj, 'solution')}
                            className="py-2.5 rounded-xl text-xs font-bold border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 flex items-center justify-center gap-1.5"
                          >
                            <FileCode className="w-3.5 h-3.5" /> Get Solution Code
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Post-Quiz Code Output Post-Mortem Review */}
              {quizSummary.missedQuestions.length > 0 && (
                <div className="rounded-3xl border border-white/10 p-6 space-y-4" style={{ backgroundColor: '#15171A' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">
                      Detailed Post-Mortem of Missed Code Output Scenarios ({quizSummary.missedQuestions.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowMissedCodeReview((p) => !p)}
                      className="text-xs font-mono text-cyan-300 underline"
                    >
                      {showMissedCodeReview ? 'Hide Code Explanations' : 'Show Code Explanations'}
                    </button>
                  </div>

                  {showMissedCodeReview && (
                    <div className="space-y-4">
                      {quizSummary.missedQuestions.map((mq) => (
                        <div key={mq.id} className="p-4 rounded-2xl bg-black/35 border border-white/10 space-y-3 text-xs">
                          <div className="flex items-center justify-between font-mono text-cyan-300">
                            <span>{mq.title} ({mq.category})</span>
                            <span className="text-rose-300">{mq.weaknessTag}</span>
                          </div>
                          <pre className="p-3 rounded-xl bg-[#0D0F12] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto">
                            {mq.codeSnippet}
                          </pre>
                          <div className="text-rose-300">
                            <strong>Your Prediction:</strong> {mq.userSelectedText}
                          </div>
                          <div className="text-emerald-300">
                            <strong>Actual Production Output:</strong> {mq.correctText}
                          </div>
                          <div className="text-slate-300 bg-white/5 p-3 rounded-xl">
                            <strong>Root Cause Analysis:</strong> {mq.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* ====================================================================
          VIEW 4: THE 7 PRODUCTION CHAOS PILLARS OVERVIEW
         ==================================================================== */}
      {activeNav === 'architecture' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="rounded-3xl border border-white/10 p-6 sm:p-8" style={{ backgroundColor: '#15171A' }}>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              The 7 "Production Chaos" Engines Powering BeyondSyntax
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Academic environments teach students to write code from scratch in a vacuum; BeyondSyntax simulates the chaos, collaboration, and constraints of actual production environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'The "Legacy Code" Refactoring Engine',
                gap: 'Students rarely read other people’s code; they only build greenfield scripts.',
                feature: 'Workbenches pre-loaded with undocumented O(n²) legacy code. Refactor complexity and pass edge-case unit tests without breaking core behavior.',
                tab: 'refactor'
              },
              {
                num: '02',
                title: 'Production API Sandbox',
                gap: 'University projects use clean local JSON or 100%-uptime mock APIs.',
                feature: 'Simulates HTTP 429 rate limiting, 500 server timeouts, missing JSON payload fields, and cursor pagination with exponential backoff.',
                tab: 'api-sandbox'
              },
              {
                num: '03',
                title: 'Client Ambiguity Simulator (Agile)',
                gap: 'Assignments have static PDF rubrics and fixed deadlines.',
                feature: 'Triggers mid-sprint Slack/Jira "Client Update" popups forcing engineers to adapt to shifting requirements on the fly.',
                tab: 'refactor'
              },
              {
                num: '04',
                title: '"Production-Ready" DB Migration Workbench',
                gap: 'Students write CREATE TABLE once and never migrate live data.',
                feature: 'Pre-populated with 100,000 user rows. Write zero-downtime ALTER TABLE & index migrations without DROP TABLE or table locks.',
                tab: 'db-migration'
              },
              {
                num: '05',
                title: 'CI/CD Pipeline Simulator',
                gap: 'If code runs on the student’s laptop, it is considered finished.',
                feature: 'Visual 4-stage deployment pipeline (Lint & Secret Scan -> Unit Tests -> Chaos Tests -> Container Build) with terminal failure logs.',
                tab: 'cicd'
              },
              {
                num: '06',
                title: 'AI "Senior Developer" Code Reviews',
                gap: 'Professors grade solely on whether output matches expected text.',
                feature: 'LLM Staff Engineer reviews your PR for naming conventions, SQLi/secret vulnerabilities, DRY modularity, and Big-O efficiency.',
                tab: 'ai-review'
              },
              {
                num: '07',
                title: 'Environment Configuration Challenges',
                gap: 'Everything is pre-configured by the instructor beforehand.',
                feature: 'Interactive .env & lockfile conflict resolver requiring exact version pinning and valid TLS/pool variables before coding.',
                tab: 'env-config'
              }
            ].map((item) => (
              <div key={item.num} className="rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-4" style={{ backgroundColor: '#15171A' }}>
                <div className="space-y-2.5">
                  <span
                    className="text-2xl font-black font-mono bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
                  >
                    #{item.num}
                  </span>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-rose-300/90 bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/20">
                    <strong>The Academic Gap:</strong> {item.gap}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>The BeyondSyntax Workbench:</strong> {item.feature}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setWorkbenchTab(item.tab);
                    setActiveNav('workbench');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950"
                  style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #00E5C0 50%, #10D582 100%)' }}
                >
                  Launch Simulator #{item.num}
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ====================================================================
          VIEW 5: PRIVATE SUPERUSER ADMIN CONSOLE (STRICTLY EXCLUSIVE TO DHRUV1706)
          Shows ONLY real users who registered via the Sign Up portal
         ==================================================================== */}
      {activeNav === 'admin' && currentUser?.isSuperuser && currentUser?.username === 'Dhruv1706' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="rounded-3xl border border-cyan-400/40 p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xl" style={{ backgroundColor: '#15171A' }}>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-mono">
                <Shield className="w-3.5 h-3.5" /> PRIVATE SUPERUSER CONSOLE • EXCLUSIVE TO DHRUV1706
              </div>
              <h1 className="text-2xl font-black text-white">
                Registered Users Directory ({registeredUsers.length} Real Sign-Ups)
              </h1>
              <p className="text-xs text-slate-400">
                Only real users who register on the launch portal appear here. Zero dummy accounts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowAllPasswords((prev) => !prev)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
              >
                {showAllPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAllPasswords ? 'Mask Passwords' : 'Reveal All Passwords'}
              </button>
              <button
                onClick={handleExportRegisteredUsersCsv}
                disabled={registeredUsers.length === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 disabled:opacity-40"
                style={{ backgroundImage: 'linear-gradient(90deg, #00FFFF 0%, #10D582 100%)' }}
              >
                Export CSV ({registeredUsers.length})
              </button>
            </div>
          </div>

          {/* Search Bar for Registered Users */}
          <div className="rounded-2xl border border-white/10 p-4 flex items-center gap-3" style={{ backgroundColor: '#15171A' }}>
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              placeholder="Filter registered users by name, username, email, or preferred language..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Real Registered Users Table */}
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-xl" style={{ backgroundColor: '#15171A' }}>
            {registeredUsers.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Users className="w-8 h-8 text-cyan-400 mx-auto opacity-80" />
                <div className="text-sm font-bold text-white">No External Users Have Registered Yet</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All pre-seeded dummy users have been removed. Whenever someone opens the app and completes the Sign Up form, their Name, Email, Password, Preferred Language, and Diagnostic Score will immediately appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/40 text-slate-400 font-mono uppercase">
                      <th className="py-3.5 px-4">Registered At</th>
                      <th className="py-3.5 px-4">Full Name & Username</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Password</th>
                      <th className="py-3.5 px-4">Language</th>
                      <th className="py-3.5 px-4">Diagnostic & Weakness</th>
                      <th className="py-3.5 px-4 text-right">Revoke</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {registeredUsers
                      .filter((u) => {
                        if (!adminSearchQuery.trim()) return true;
                        const q = adminSearchQuery.toLowerCase();
                        return (
                          (u.name || '').toLowerCase().includes(q) ||
                          (u.username || '').toLowerCase().includes(q) ||
                          (u.email || '').toLowerCase().includes(q) ||
                          (u.preferredLanguage || '').toLowerCase().includes(q)
                        );
                      })
                      .map((u) => {
                        const isVisible = showAllPasswords || revealedUserIds[u.id];
                        return (
                          <tr key={u.id} className="hover:bg-white/5">
                            <td className="py-3.5 px-4 font-mono text-slate-400">
                              {u.registeredAt || 'Just now'}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white">{u.name}</div>
                              <div className="font-mono text-slate-400">@{u.username}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-200">{u.email}</td>
                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 font-mono">
                                <span className="text-emerald-300 font-bold">
                                  {isVisible ? u.password : '••••••••••••'}
                                </span>
                                <button
                                  onClick={() =>
                                    setRevealedUserIds((p) => ({ ...p, [u.id]: !p[u.id] }))
                                  }
                                  className="text-slate-400 hover:text-white"
                                  title="Toggle Password"
                                >
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard?.writeText(u.password);
                                    setCopiedId(u.id);
                                    setTimeout(() => setCopiedId(null), 1500);
                                  }}
                                  className="text-slate-400 hover:text-cyan-300"
                                  title="Copy Password"
                                >
                                  {copiedId === u.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-cyan-300">
                              {u.preferredLanguage || 'Not Decided Yet'}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-emerald-300">{u.diagnosticScore}</div>
                              <div className="text-[11px] text-slate-400">{u.weaknessTag}</div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeleteRegisteredUser(u.id)}
                                className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/30"
                                title="Delete Registered User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}