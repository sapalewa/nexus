import React, { useState } from 'react';
import { 
  Code2, 
  FolderTree, 
  Copy, 
  Check, 
  Rocket, 
  Database, 
  FileCode, 
  Download,
  BookOpen,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  PRODUCTION_CODE_FILES, 
  NEXTJS_FOLDER_STRUCTURE, 
  VERCEL_DEPLOYMENT_GUIDE, 
  CodeFile 
} from '../data/productionCodeFiles';

export const ArchitectureView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [activeMainTab, setActiveMainTab] = useState<'files' | 'structure' | 'deployment'>('files');
  const [copied, setCopied] = useState(false);

  const currentFile = PRODUCTION_CODE_FILES[selectedFileIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Code2 className="w-8 h-8 text-indigo-400" />
            Code Hub & Production Architecture
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Source code lengkap, skema SQL Supabase, dan panduan deployment Vercel siap pakai.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveMainTab('files')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMainTab === 'files'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Source Code Files</span>
          </button>

          <button
            onClick={() => setActiveMainTab('structure')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMainTab === 'structure'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Struktur Folder Next.js</span>
          </button>

          <button
            onClick={() => setActiveMainTab('deployment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMainTab === 'deployment'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Panduan Deployment</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Source Code Files */}
      {activeMainTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File List Selector */}
          <div className="lg:col-span-1 space-y-2 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 h-fit">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-2">
              Daftar File Mandatori:
            </div>
            {PRODUCTION_CODE_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left p-3 rounded-2xl text-xs transition border ${
                  selectedFileIndex === idx
                    ? 'bg-indigo-600/20 text-white border-indigo-500/40 shadow-sm font-semibold'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="font-mono text-[11px] text-indigo-300 truncate">{file.path}</div>
                <div className="text-slate-300 text-xs mt-1 truncate font-medium">{file.title}</div>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-3 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            {/* Viewer Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">{currentFile.path}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {currentFile.language}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentFile.description}</p>
              </div>

              <button
                onClick={() => handleCopy(currentFile.content)}
                className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-950 transition active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Kode'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 bg-slate-950/90 overflow-x-auto max-h-[620px] font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {currentFile.content}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Next.js Folder Structure */}
      {activeMainTab === 'structure' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-400" />
                Struktur Folder Next.js App Router Lengkap
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Arsitektur modular siap deploy ke Vercel dengan pemisahan concern yang rapi.
              </p>
            </div>
            <button
              onClick={() => handleCopy(NEXTJS_FOLDER_STRUCTURE)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Struktur</span>
            </button>
          </div>

          <pre className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
            {NEXTJS_FOLDER_STRUCTURE}
          </pre>
        </div>
      )}

      {/* Main Tab 3: Deployment Guide */}
      {activeMainTab === 'deployment' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-400" />
                Panduan Step-by-Step Deployment Vercel & Webhook Setup
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Petunjuk komprehensif mulai dari Supabase DDL, Meta Cloud API, hingga verifikasi token live online.
              </p>
            </div>
            <button
              onClick={() => handleCopy(VERCEL_DEPLOYMENT_GUIDE)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Panduan</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 whitespace-pre-wrap font-sans">
              {VERCEL_DEPLOYMENT_GUIDE}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
