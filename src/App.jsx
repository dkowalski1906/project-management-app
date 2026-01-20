import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Menu, Search, Filter, Plus, User, Moon, Sun, X, BarChart2, Users, CheckSquare, Folder, PlusCircle, ChevronDown, ChevronUp, Calendar, ArrowUpDown, Clock, Check, ArrowLeft, MoreHorizontal, Layout, Tag, Edit3, Trash2, MessageSquare, Send, Paperclip, Save, AlertTriangle, Briefcase, Activity, TrendingUp, PieChart, RotateCcw, BriefcaseBusiness, Home, Eye, PenTool, ArrowUp, ArrowDown } from 'lucide-react';

// --- 0. Données Initiales (Dataset) ---

const INITIAL_DATA = {
  "users": [
    { "id": "u1", "name": "Alex", "role": "Admin" },
    { "id": "u2", "name": "Sarah", "role": "Designer" },
    { "id": "u3", "name": "Mike", "role": "Backend Dev" },
    { "id": "u4", "name": "Emma", "role": "QA Tester" }
  ],
  "projects": [
    {
      "id": 101,
      "title": "Projet Spring Boot",
      "description": "Développement d'un backend robuste avec Spring Boot et Hibernate pour la gestion des stocks.",
      "deadline": "2026-06-30",
      "members": ["u3"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": [
        {
          "id": 1001,
          "title": "Mise en place de la BDD",
          "status": "A Faire",
          "priority": "High",
          "tag": "Backend",
          "assignee": "Mike",
          "deadline": "2026-06-30",
          "description": "# Objectifs\n- [ ] Initialiser PostgreSQL\n- [ ] Configurer les schémas JPA\n- [ ] Créer le user de service\n\n## Notes\nUtiliser la version 14 de PG.",
          "comments": []
        }
      ]
    },
    {
      "id": 102,
      "title": "Projet Site web",
      "description": "Refonte de l'interface utilisateur pour maximiser les conversions et moderniser l'image de marque.",
      "deadline": "2026-01-09",
      "members": ["u2"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 5,
      "title": "Migration Cloud 2026",
      "description": "Transfert sécurisé de l'infrastructure vers un cloud hybride scalable.",
      "deadline": "2026-06-15",
      "members": ["u4"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 103,
      "title": "App Mobile Fitness",
      "description": "Tracking de calories et exercices personnalisés via React Native.",
      "deadline": "2026-04-12",
      "members": ["u1", "u2"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 104,
      "title": "Analyse Big Data",
      "description": "Traitement de flux de données massifs avec Apache Spark et Hadoop.",
      "deadline": "2026-02-28",
      "members": ["u3", "u4", "u1"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 105,
      "title": "Sécurité Réseau",
      "description": "Audit de vulnérabilité et mise en place de pare-feux avancés.",
      "deadline": "2026-03-15",
      "members": ["u2"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 106,
      "title": "Plateforme LMS",
      "description": "Système de gestion de l'apprentissage pour les écoles primaires.",
      "deadline": "2026-01-20",
      "members": ["u1", "u4"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 107,
      "title": "Automatisation CI/CD",
      "description": "Pipeline de déploiement continu avec Jenkins, GitHub Actions et Kubernetes.",
      "deadline": "2026-05-10",
      "members": ["u3"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 108,
      "title": "Refonte CRM",
      "description": "Amélioration de la gestion de la relation client pour une PME locale.",
      "deadline": "2026-07-22",
      "members": ["u2", "u3"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 109,
      "title": "API de Paiement",
      "description": "Passerelle de paiement sécurisée conforme aux normes PCI-DSS.",
      "deadline": "2026-03-30",
      "members": ["u4"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 110,
      "title": "Dashboard Logistique",
      "description": "Visualisation en temps réel de la flotte de camions et livraisons.",
      "deadline": "2026-08-05",
      "members": ["u1", "u2", "u4"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 111,
      "title": "Outil SEO Interne",
      "description": "Analyseur de mots-clés et suivi de positionnement Google.",
      "deadline": "2026-02-14",
      "members": ["u1"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    },
    {
      "id": 112,
      "title": "Chatbot Support",
      "description": "IA conversationnelle basée sur LLM pour le support client de premier niveau.",
      "deadline": "2026-09-30",
      "members": ["u3", "u4"],
      "columns": ["A Faire", "En Cours", "Terminé"],
      "tasks": []
    }
  ]
};

// --- 1. Utilitaires de données ---

const getLocalTasks = (projectId, defaultTasks) => {
    const saved = localStorage.getItem(`tasks_${projectId}`);
    return saved ? JSON.parse(saved) : defaultTasks;
};

const saveLocalTasks = (projectId, tasks) => {
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(tasks));
};

const getLocalColumns = (projectId, defaultColumns) => {
    const saved = localStorage.getItem(`columns_${projectId}`);
    return saved ? JSON.parse(saved) : defaultColumns;
};

const saveLocalColumns = (projectId, columns) => {
    localStorage.setItem(`columns_${projectId}`, JSON.stringify(columns));
};

// --- 2. Composants de Base UI ---

const Card = ({ children, className = "", onClick, draggable, onDragStart, onDragOver, onDrop }) => (
  <div 
    onClick={onClick}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDrop={onDrop}
    className={`bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
  >
    {children}
  </div>
);

const SatisfyingProgressBar = ({ progress }) => (
  <div className="flex items-center gap-3 w-full mt-4 mb-1 select-none">
    <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
        <div 
            className="h-full bg-blue-500 dark:bg-blue-600 shadow-[2px_0_10px_rgba(59,130,246,0.4)] transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
        >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
        </div>
    </div>
    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 min-w-[3ch] text-right">
        {progress}%
    </span>
  </div>
);

const StatusCount = ({ count, color, label }) => (
  <div className="flex items-center gap-1.5 group/status" title={label}>
    <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">{count}</span>
    <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm ring-2 ring-transparent group-hover/status:ring-${color}/30 transition-all duration-300 scale-100 group-hover/status:scale-125`}></div>
  </div>
);

const Toast = ({ message, type, show, onClose, action }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const bgColors = { success: 'bg-emerald-500', error: 'bg-rose-500', info: 'bg-slate-800' };

    return (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-in slide-in-from-right-10 ${bgColors[type] || bgColors.success}`}>
            <div className="flex items-center gap-3">
                {type === 'success' ? <CheckSquare size={20} /> : <AlertTriangle size={20} />}
                {message}
            </div>
            {action && (
                <button 
                    onClick={() => { action.onClick(); onClose(); }} 
                    className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs uppercase tracking-wider transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

// --- 3. Composants de Saisie et Filtres ---

const StatusSelect = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const options = [
        { value: "A Faire", color: "bg-rose-50 text-rose-600 border-rose-200", label: "A FAIRE" },
        { value: "En Cours", color: "bg-amber-50 text-amber-600 border-amber-200", label: "EN COURS" },
        { value: "Terminé", color: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "TERMINÉ" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`px-4 py-2 rounded-xl border-2 font-bold uppercase text-sm flex items-center gap-2 transition-all ${selectedOption.color} hover:brightness-95 active:scale-95`}
            >
                {selectedOption.label}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange({ target: { value: opt.value } }); setIsOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                        >
                            <div className={`w-3 h-3 rounded-full ${opt.color.replace('bg-', 'bg-').split(' ')[0].replace('-50', '-500')}`}></div>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const MarkdownEditor = ({ value, onChange, placeholder, className }) => {
    const [viewMode, setViewMode] = useState('edit');

    const handlePreviewClick = (e) => {
        if (e.target.dataset.checkboxIndex !== undefined) {
            const index = parseInt(e.target.dataset.checkboxIndex, 10);
            const isChecked = e.target.dataset.checked === 'true';
            
            const before = value.substring(0, index);
            const after = value.substring(index + 3);
            const newStatus = isChecked ? ' ' : 'x';
            
            onChange({ target: { value: `${before}[${newStatus}]${after}` } });
        }
    };

    const parseSimpleMarkdown = (text) => {
        if (!text) return '';
        let currentIndex = 0;
        
        const lines = text.split('\n');
        let htmlLines = lines.map((line) => {
            const lineStartInText = currentIndex;
            currentIndex += line.length + 1;

            const checkboxMatch = line.match(/^(\s*)-\s\[([ x])\]\s(.*)$/);
            if (checkboxMatch) {
                const indent = checkboxMatch[1];
                const isChecked = checkboxMatch[2] === 'x';
                const content = checkboxMatch[3];
                const checkboxIndex = lineStartInText + line.indexOf('[', indent.length);
                
                return `<div class="flex items-start gap-3 my-1.5 pl-1 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded p-1 -ml-1 transition-colors" data-checkbox-index="${checkboxIndex}" data-checked="${isChecked}">
                    <div class="mt-0.5 w-5 h-5 rounded border-2 ${isChecked ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'} flex items-center justify-center flex-shrink-0 pointer-events-none transition-all">
                        ${isChecked ? '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>' : ''}
                    </div>
                    <span class="text-slate-700 dark:text-slate-300 flex-1 leading-snug pointer-events-none ${isChecked ? 'line-through text-slate-400 decoration-slate-400' : ''}">${content}</span>
                </div>`;
            }

            let processedLine = line
                .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/^### (.*$)/, '<h3 class="text-lg font-bold mt-3 mb-2 text-slate-800 dark:text-white">$1</h3>')
                .replace(/^## (.*$)/, '<h2 class="text-xl font-bold mt-4 mb-3 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">$1</h2>')
                .replace(/^# (.*$)/, '<h1 class="text-2xl font-bold mt-5 mb-4 text-slate-900 dark:text-white">$1</h1>')
                .replace(/\*\*(.*)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
                .replace(/\*(.*)\*/g, '<em class="italic text-slate-600 dark:text-slate-300">$1</em>')
                .replace(/^- (.*$)/, '<li class="ml-4 list-disc marker:text-blue-500 pl-1 mb-1 text-slate-600 dark:text-slate-300">$1</li>');
                
            return processedLine;
        });

        return htmlLines.join('<br>');
    };

    return (
        <div className={`flex flex-col border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 ${className}`}>
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5">
                <button 
                    onClick={() => setViewMode('edit')} 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <PenTool size={14} /> Éditer
                </button>
                <button 
                    onClick={() => setViewMode('preview')} 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <Eye size={14} /> Aperçu
                </button>
                <div className="ml-auto text-[10px] text-slate-400 font-medium px-2">
                    Markdown supporté
                </div>
            </div>
            
            {viewMode === 'edit' ? (
                <textarea 
                    value={value || ''} 
                    onChange={onChange} 
                    placeholder={placeholder} 
                    className="w-full p-4 bg-transparent focus:outline-none min-h-[200px] resize-y font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200" 
                />
            ) : (
                <div 
                    onClick={handlePreviewClick}
                    className="w-full p-4 bg-white dark:bg-slate-900/50 min-h-[200px] prose dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(value) }}
                />
            )}
        </div>
    );
};

const DoubleRangeSlider = ({ min, max, onChange, minBound = 0, maxBound = 100, formatLabel = v => v + '%' }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    
    useEffect(() => {
        setMinVal(min);
        setMaxVal(max);
    }, [min, max]);

    const getPercent = useCallback((value) => Math.round(((value - minBound) / (maxBound - minBound)) * 100), [minBound, maxBound]);

    return (
        <div className="relative w-full h-12 flex items-center justify-center select-none pt-4 mb-8">
            <div className="absolute w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full z-0 top-1/2 -translate-y-1/2"></div>
            <div 
                className="absolute h-2 bg-blue-500 rounded-full z-10 top-1/2 -translate-y-1/2"
                style={{ left: `${getPercent(minVal)}%`, width: `${getPercent(maxVal) - getPercent(minVal)}%` }}
            ></div>

            <div className="relative w-full h-2">
                <input 
                    type="range" min={minBound} max={maxBound} value={minVal}
                    onChange={(e) => {
                        const value = Math.min(Number(e.target.value), maxVal - 1);
                        setMinVal(value);
                        onChange(value, maxVal);
                    }}
                    className="thumb--input absolute w-full pointer-events-none appearance-none bg-transparent outline-none z-30"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input 
                    type="range" min={minBound} max={maxBound} value={maxVal}
                    onChange={(e) => {
                        const value = Math.max(Number(e.target.value), minVal + 1);
                        setMaxVal(value);
                        onChange(minVal, value);
                    }}
                    className="thumb--input absolute w-full pointer-events-none appearance-none bg-transparent outline-none z-30"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
            </div>

            <div className="absolute -bottom-6 w-full flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 pointer-events-none px-1">
                <span>{formatLabel(minBound)}</span>
                <span>{formatLabel(maxBound)}</span>
            </div>

            <div className="absolute top-0 w-full pointer-events-none">
               <span 
                    className="absolute text-xs font-bold text-blue-600 dark:text-blue-400 -translate-x-1/2 -translate-y-[14px]"
                    style={{ left: `${getPercent(minVal)}%` }}
                >
                    {formatLabel(minVal)}
                </span>
               <span 
                    className="absolute text-xs font-bold text-blue-600 dark:text-blue-400 -translate-x-1/2 -translate-y-[14px]"
                    style={{ left: `${getPercent(maxVal)}%` }}
                >
                    {formatLabel(maxVal)}
                </span>
            </div>

            <style>{`
                .thumb--input::-webkit-slider-thumb {
                    pointer-events: auto;
                    -webkit-appearance: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #3b82f6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                    margin-top: 0px;
                    position: relative;
                    z-index: 50;
                }
                .thumb--input::-moz-range-thumb {
                    pointer-events: auto;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #3b82f6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

const MultiSelect = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (optionId) => {
        if (selected.includes(optionId)) onChange(selected.filter(id => id !== optionId));
        else onChange([...selected, optionId]);
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">{label}</label>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-left text-sm font-medium hover:border-blue-400 transition-all"
            >
                <span className="truncate text-slate-700 dark:text-slate-300">
                    {selected.length === 0 ? "Tous les membres" : `${selected.length} membre(s) choisi(s)`}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto p-1">
                    {options.map(opt => (
                        <div key={opt.id} onClick={() => toggleOption(opt.id)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selected.includes(opt.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                {selected.includes(opt.id) && <Check size={14} className="text-white" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{opt.name}</span>
                                <span className="text-xs text-slate-400">{opt.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Nouveau Composant de Tri (Menu Extérieur) ---

const SortControl = ({ sortConfig, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const labels = { deadline: 'Date', title: 'Nom', progress: 'Progression' };

    return (
        <div className="relative" ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-4 border-2 rounded-2xl transition-all shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white hover:border-blue-500 hover:text-blue-500 flex items-center gap-2 h-full"
                title="Trier les projets"
            >
                <ArrowUpDown size={22} />
                <span className="hidden md:inline text-sm font-bold">{labels[sortConfig.key]}</span>
            </button>
            
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden z-50 p-3 space-y-4 animate-in fade-in zoom-in duration-200">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 px-1">Critère de tri</p>
                        <div className="space-y-1">
                        {['deadline', 'title', 'progress'].map(key => (
                            <button
                                key={key}
                                onClick={() => { onSortChange({ ...sortConfig, key }); setIsOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${sortConfig.key === key ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                {labels[key]}
                                {sortConfig.key === key && <Check size={14} />}
                            </button>
                        ))}
                        </div>
                    </div>
                    <div>
                         <p className="text-xs font-bold text-slate-400 uppercase mb-2 px-1">Ordre</p>
                         <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                            <button 
                                onClick={() => { onSortChange({ ...sortConfig, direction: 'asc' }); }} 
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${sortConfig.direction === 'asc' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Croissant"
                            >
                                <ArrowUp size={16} />
                            </button>
                            <button 
                                onClick={() => { onSortChange({ ...sortConfig, direction: 'desc' }); }} 
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${sortConfig.direction === 'desc' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Décroissant"
                            >
                                <ArrowDown size={16} />
                            </button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 4. Modales ---

const ProjectFilterModal = ({ isOpen, onClose, onApply, currentFilters, usersList, sortConfig, onSortChange }) => {
    const [localProgressMin, setLocalProgressMin] = useState(currentFilters.progressMin);
    const [localProgressMax, setLocalProgressMax] = useState(currentFilters.progressMax);
    const [localSelectedPeople, setLocalSelectedPeople] = useState(currentFilters.selectedPeople);
    const [localDeadlineMin, setLocalDeadlineMin] = useState(currentFilters.deadlineMin);
    const [localDeadlineMax, setLocalDeadlineMax] = useState(currentFilters.deadlineMax);
    const [localShowOverdue, setLocalShowOverdue] = useState(currentFilters.showOverdue);
    
    // Local sort state
    const [localSortKey, setLocalSortKey] = useState(sortConfig.key);
    const [localSortDirection, setLocalSortDirection] = useState(sortConfig.direction);

    const MAX_DAYS = 180;

    useEffect(() => {
        if(isOpen) {
            setLocalProgressMin(currentFilters.progressMin);
            setLocalProgressMax(currentFilters.progressMax);
            setLocalSelectedPeople(currentFilters.selectedPeople);
            setLocalDeadlineMin(currentFilters.deadlineMin);
            setLocalDeadlineMax(currentFilters.deadlineMax);
            setLocalShowOverdue(currentFilters.showOverdue);
            setLocalSortKey(sortConfig.key);
            setLocalSortDirection(sortConfig.direction);
        }
    }, [isOpen, currentFilters, sortConfig]);

    if (!isOpen) return null;

    const handleReset = () => {
        setLocalProgressMin(0);
        setLocalProgressMax(100);
        setLocalSelectedPeople([]);
        setLocalDeadlineMin(0);
        setLocalDeadlineMax(MAX_DAYS);
        setLocalShowOverdue(true);
        setLocalSortKey('deadline');
        setLocalSortDirection('asc');
    };

    const formatDays = (days) => {
        if (days === 0) return "Aujourd'hui";
        if (days >= 30) return `${Math.round(days / 30)} mois`;
        if (days >= 7) return `${Math.round(days / 7)} sem`;
        return `${days}j`;
    };

    const hasActiveFilters = 
        localProgressMin > 0 || 
        localProgressMax < 100 || 
        localSelectedPeople.length > 0 || 
        localDeadlineMin > 0 || 
        localDeadlineMax < MAX_DAYS || 
        !localShowOverdue;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl relative z-10 max-w-lg w-full mx-4 border-2 border-slate-100 dark:border-slate-700 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 shrink-0">
                    <h3 className="font-bold text-slate-800 dark:text-white text-xl">Filtres et Tri</h3>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <button onClick={handleReset} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all md:hidden" title="Effacer tout">
                                <RotateCcw size={18} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"><X size={20} /></button>
                    </div>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-10 pb-4">
                        
                        {/* Section Tri */}
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Trier par</p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {['deadline', 'title', 'progress'].map(key => (
                                    <button 
                                        key={key}
                                        onClick={() => setLocalSortKey(key)}
                                        className={`px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${localSortKey === key ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                    >
                                        {key === 'deadline' ? 'Date' : key === 'title' ? 'Nom' : 'Progression'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                                <button 
                                    onClick={() => setLocalSortDirection('asc')} 
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${localSortDirection === 'asc' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                                >
                                    <ArrowUp size={16} /> Croissant
                                </button>
                                <button 
                                    onClick={() => setLocalSortDirection('desc')} 
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${localSortDirection === 'desc' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                                >
                                    <ArrowDown size={16} /> Décroissant
                                </button>
                            </div>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />

                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Progression (%)</p>
                            <DoubleRangeSlider min={localProgressMin} max={localProgressMax} onChange={(min, max) => { setLocalProgressMin(min); setLocalProgressMax(max); }} />
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Échéance à venir</p>
                                <button 
                                    onClick={() => setLocalShowOverdue(!localShowOverdue)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${localShowOverdue ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'}`}
                                >
                                    <Clock size={14} />
                                    En retard
                                    {localShowOverdue && <Check size={12} />}
                                </button>
                            </div>
                            
                            <DoubleRangeSlider 
                                min={localDeadlineMin} 
                                max={localDeadlineMax} 
                                minBound={0} 
                                maxBound={MAX_DAYS} 
                                formatLabel={formatDays}
                                onChange={(min, max) => { setLocalDeadlineMin(min); setLocalDeadlineMax(max); }} 
                            />
                        </div>

                        <MultiSelect label="Membres de l'équipe" options={usersList} selected={localSelectedPeople} onChange={setLocalSelectedPeople} />
                    </div>
                </div>
                <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl flex gap-4">
                    {hasActiveFilters && (
                        <button onClick={handleReset} className="px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all hidden md:block">
                            Réinitialiser
                        </button>
                    )}
                    <button 
                        onClick={() => { 
                            onApply({ 
                                progressMin: localProgressMin, 
                                progressMax: localProgressMax, 
                                selectedPeople: localSelectedPeople,
                                deadlineMin: localDeadlineMin,
                                deadlineMax: localDeadlineMax,
                                showOverdue: localShowOverdue
                            });
                            onSortChange({ key: localSortKey, direction: localSortDirection });
                            onClose(); 
                        }} 
                        className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center animate-in">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 relative z-10 max-w-md w-full mx-4 border-2 border-slate-100 dark:border-slate-700 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 mx-auto"><AlertTriangle size={24} /></div>
                <h2 className="text-xl font-bold dark:text-white mb-2">Êtes-vous sûr ?</h2>
                <p className="text-slate-500 mb-6 text-sm">{message || "Cette action supprimera définitivement l'élément."}</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 dark:border-slate-700 dark:text-slate-300 font-bold">Annuler</button>
                    <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold">Supprimer</button>
                </div>
            </div>
        </div>
    );
};

const AddMemberModal = ({ isOpen, onClose, onAdd, availableUsers }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center animate-in">
             <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
             <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 relative z-10 max-w-sm w-full mx-4 border-2 border-slate-100 dark:border-slate-700 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg dark:text-white">Ajouter au projet</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-2">
                    {availableUsers.length === 0 ? (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400"><Users size={20} /></div>
                            <p className="text-slate-500 text-sm font-medium">Tout le monde est déjà sur le pont !</p>
                        </div>
                    ) : (
                        availableUsers.map(user => (
                            <button key={user.id} onClick={() => onAdd(user.id)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left group">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">{user.name.charAt(0)}</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{user.name}</span>
                                    <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">{user.role}</span>
                                </div>
                                <div className="ml-auto w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <Plus size={16} />
                                </div>
                            </button>
                        ))
                    )}
                </div>
             </div>
        </div>
    );
};

const UserModal = ({ isOpen, onClose, onSave, userToEdit = null }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setName(userToEdit.name);
                setRole(userToEdit.role);
            } else {
                setName('');
                setRole('');
            }
        }
    }, [isOpen, userToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !role.trim()) return;
        onSave({ id: userToEdit?.id, name, role });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center animate-in">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 relative z-10 max-w-md w-full mx-4 border-2 border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{userToEdit ? 'Modifier le membre' : 'Nouveau membre'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Nom complet</label>
                        <input autoFocus type="text" required className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-all font-medium" placeholder="Ex: Jean Dupont" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Rôle / Spécialité</label>
                        <input type="text" required className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-all font-medium" placeholder="Ex: Frontend Dev" value={role} onChange={e => setRole(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                        {userToEdit ? 'Sauvegarder les modifications' : 'Ajouter à l\'équipe'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- 5. Composants Métier (Projets & Tâches) ---

const ProjectCard = ({ title, description, progress, teamCount, stats, deadline, onClick, onDelete, draggable, onDragStart, onDragOver, onDrop }) => {
    const dateObj = new Date(deadline);
    const now = new Date();
    const isOverdue = dateObj.setHours(0,0,0,0) < now.setHours(0,0,0,0);
    const diffTime = dateObj - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const isUrgent = !isOverdue && diffDays <= 7 && diffDays >= 0;
    const dateStr = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Card className="p-6 mb-5 group relative" onClick={onClick} draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}>
      
      {/* Bouton de suppression du projet */}
      <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 bg-white/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm shadow-sm border border-slate-100 dark:border-slate-700"
          title="Supprimer le projet"
      >
          <Trash2 size={18} />
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-4">
        <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mt-1 line-clamp-2 mb-3">{description}</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${isOverdue ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400' : isUrgent ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                <Clock size={12} /> {isOverdue ? 'En retard' : dateStr}
            </div>
        </div>
        <div className="flex flex-col items-end gap-3 min-w-fit">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
             <StatusCount count={stats.todo} color="bg-rose-500" label="To do" />
             <StatusCount count={stats.doing} color="bg-amber-400" label="Doing" />
             <StatusCount count={stats.done} color="bg-emerald-500" label="Done" />
          </div>
          <div className="flex items-center -space-x-2 pl-2">
            {[...Array(Math.min(teamCount, 3))].map((_, i) => (<div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center relative z-0"><User size={14} className="text-slate-500 dark:text-slate-400" /></div>))}
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300 relative z-10">{teamCount}</div>
          </div>
        </div>
      </div>
      <div className="pt-1"><SatisfyingProgressBar progress={progress} /></div>
    </Card>
  );
};

const KanbanTask = ({ task, onDragStart, onClick }) => {
    const priorityLabels = {
        'High': 'Urgence : Haute',
        'Medium': 'Urgence : Normale',
        'Low': 'Urgence : Faible'
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all group relative z-10" draggable="true" onDragStart={(e) => onDragStart(e, task.id)} onClick={() => onClick(task)}>
            <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"><Tag size={10} /><span>{task.tag || 'Général'}</span></div>
                 <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ml-auto ${task.priority === 'High' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                    {priorityLabels[task.priority] || task.priority}
                 </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 leading-relaxed line-clamp-2">{task.title}</h4>
            <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-700/50">
                 <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{task.assignee.charAt(0)}</div><span className="text-xs font-medium text-slate-500 dark:text-slate-400">{task.assignee}</span></div>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500"><Clock size={10} />{task.deadline}</div>
            </div>
        </div>
    );
};

const KanbanColumn = ({ title, count, color, tasks, status, onDrop, onDragStart, onTaskClick, onColumnDragStart, onColumnDrop, onRename, onDelete }) => {
    const [isOver, setIsOver] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const dragCounter = useRef(0);

    const handleDragEnter = (e) => { 
        if (e.dataTransfer.types.includes("taskid") || e.dataTransfer.types.includes("taskId")) {
            e.preventDefault(); 
            dragCounter.current++;
            setIsOver(true); 
        }
    };
    const handleDragLeave = (e) => { 
        e.preventDefault(); 
        dragCounter.current--;
        if (dragCounter.current <= 0) setIsOver(false); 
    };
    const handleDropInternal = (e) => {
        e.preventDefault();
        setIsOver(false);
        dragCounter.current = 0;
        const tId = e.dataTransfer.getData("taskid") || e.dataTransfer.getData("taskId");
        const cName = e.dataTransfer.getData("colname") || e.dataTransfer.getData("colName");
        
        if (tId) {
            onDrop(e, status);
        } else if (cName) {
            onColumnDrop(e, title);
        }
    };

    const handleSaveTitle = () => {
        if (editTitle.trim() && editTitle !== title) {
            onRename(title, editTitle.trim());
        } else {
            setEditTitle(title);
        }
        setIsEditing(false);
    };

    return (
        <div 
            draggable={!isEditing}
            onDragStart={(e) => onColumnDragStart(e, title)}
            className={`flex-shrink-0 w-80 flex flex-col h-full rounded-2xl transition-all duration-200 cursor-default group/column ${isOver ? 'bg-blue-100/80 dark:bg-blue-900/40 ring-4 ring-blue-500/20 border-2 border-dashed border-blue-500 scale-[1.01]' : 'bg-transparent border-2 border-transparent'}`} 
            onDragOver={(e) => e.preventDefault()} 
            onDragEnter={handleDragEnter} 
            onDragLeave={handleDragLeave} 
            onDrop={handleDropInternal}
        >
            <div className="flex items-center justify-between mb-4 px-3 py-2 cursor-grab active:cursor-grabbing min-h-[40px]">
                {isEditing ? (
                    <input 
                        autoFocus
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                        className="w-full px-2 py-1 rounded-lg border-2 border-blue-500 outline-none text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800"
                    />
                ) : (
                    <div className="flex items-center gap-2 pointer-events-none w-full">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`}></div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide truncate flex-1">{title}</h3>
                        <span className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                    </div>
                )}
                
                {/* Actions de modification uniquement si la colonne est vide */}
                {count === 0 && !isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover/column:opacity-100 transition-opacity ml-2">
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Renommer"
                        >
                            <Edit3 size={12} />
                        </button>
                        <button 
                            onClick={() => onDelete(title)} 
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                            title="Supprimer"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>
            <div className={`flex-1 space-y-3 pb-4 min-h-[200px] rounded-xl px-2 transition-all duration-200 ${tasks.length === 0 && !isOver ? 'bg-slate-100/30 dark:bg-slate-900/10 border-2 border-dashed border-slate-200 dark:border-slate-800 mx-2' : ''} ${isOver ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
                {tasks.map(task => (<KanbanTask key={task.id} task={task} onDragStart={onDragStart} onClick={onTaskClick} />))}
            </div>
        </div>
    );
};

// --- 6. Vues Principales ---

const UserManagementView = ({ users, projects, onOpenUserModal, onDeleteUser }) => {
    // Suppression de l'état local modalState

    const getUserStats = (user) => {
        const activeProjects = projects.filter(p => p.members.includes(user.id)).length;
        let activeTasks = 0;
        
        projects.forEach(p => {
            if (p.tasks) {
                activeTasks += p.tasks.filter(t => t.assignee === user.name && t.status !== 'Terminé' && t.status !== 'Done').length;
            }
        });

        return { activeProjects, activeTasks };
    };

    return (
        <div className="animate-in flex flex-col h-full pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Gestion de l'équipe</h1>
                    <p className="text-slate-500 font-medium">Annuaire et charge de travail</p>
                </div>
                <button onClick={() => onOpenUserModal(null)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <PlusCircle size={20} /> Ajouter un membre
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => {
                    const stats = getUserStats(user);
                    const isSelf = user.id === 'u1'; // Protection pour l'admin par défaut

                    return (
                        <div key={user.id} className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onOpenUserModal(user)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 rounded-xl transition-colors" title="Modifier">
                                    <Edit3 size={16} />
                                </button>
                                {!isSelf && (
                                    <button onClick={() => onDeleteUser(user)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 rounded-xl transition-colors" title="Supprimer">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                            {user.name}
                                            {isSelf && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Moi</span>}
                                        </h3>
                                        <span className="inline-block px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600"><Briefcase size={18} /></div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Projets actifs</span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.activeProjects}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600"><Activity size={18} /></div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Tâches en cours</span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.activeTasks}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CreateProjectView = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const todayStr = new Date().toISOString().split('T')[0];
    const [deadline, setDeadline] = useState(todayStr);
    const [dateError, setDateError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (deadline < todayStr) {
            setDateError('La date ne peut pas être dans le passé.');
            return;
        }
        if (!title.trim()) return;
        onSave({ title, description, deadline });
    };

    const handleDateChange = (e) => {
        const val = e.target.value;
        setDeadline(val);
        if (val < todayStr) setDateError('La date ne peut pas être dans le passé.');
        else setDateError('');
    };

    const handleReset = () => {
        setTitle('');
        setDescription('');
        setDeadline(todayStr);
        setDateError('');
    };

    return (
        <div className="animate-in flex flex-col h-full max-w-2xl mx-auto w-full pt-8">
            <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-blue-600 transition-colors">
                <ArrowLeft size={18} /> Annuler
            </button>
            <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Créer un nouveau projet</h1>
                    <button onClick={handleReset} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" title="Réinitialiser le formulaire">
                        <RotateCcw size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Titre du projet</label>
                        <input autoFocus type="text" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-all font-medium text-lg" placeholder="Ex: Projet Spring Boot" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Description</label>
                        <textarea rows={4} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-all font-medium" placeholder="Décrivez les objectifs et technos..." value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Date limite (Deadline)</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                required 
                                min={todayStr}
                                className={`w-full px-6 py-4 rounded-2xl border-2 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none transition-all font-medium ${dateError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-100 dark:border-slate-700 focus:border-blue-500'}`} 
                                value={deadline} 
                                onChange={handleDateChange} 
                            />
                            {dateError && (
                                <div className="absolute left-0 -bottom-6 text-rose-500 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <AlertTriangle size={12} /> {dateError}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button type="button" onClick={handleReset} className="px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            Réinitialiser
                        </button>
                        <button type="submit" disabled={!!dateError} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100">
                            <PlusCircle size={20} /> Créer le projet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TaskDetailView = ({ task, projectId, onBack, onUpdateTask, users, showToast, onRestoreTask, openDeleteModal }) => {
    const isNew = !task.id;
    // Suppression du mode édition conditionnel
    const [editedTask, setEditedTask] = useState(task);
    // Suppression de l'état local showDeleteConfirm
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(task.comments || []);
    const [dateError, setDateError] = useState('');
    const todayStr = new Date().toISOString().split('T')[0];
    
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleSave = () => {
        if (editedTask.deadline < todayStr) {
            setDateError('La date ne peut pas être dans le passé.');
            showToast('Erreur : La date ne peut pas être dans le passé', 'error');
            return;
        }
        
        const currentTasks = getLocalTasks(projectId, []);
        const taskWithComments = { ...editedTask, comments };
        let updatedTasks;
        if (isNew) { 
            const newId = Date.now(); 
            const taskToSave = { ...taskWithComments, id: newId }; 
            updatedTasks = [...currentTasks, taskToSave]; 
        } else {
            updatedTasks = currentTasks.map(t => t.id === editedTask.id ? taskWithComments : t);
        }
        saveLocalTasks(projectId, updatedTasks);
        if (onUpdateTask) onUpdateTask(taskWithComments);
        showToast(isNew ? "Tâche créée avec succès" : "Tâche mise à jour", "success");
        onBack();
    };

    const handleDeleteRequest = () => {
        openDeleteModal(() => {
            const tasks = getLocalTasks(projectId, []);
            saveLocalTasks(projectId, tasks.filter(t => t.id !== task.id)); 
            
            // Logique de restauration
            const handleUndo = () => {
                const currentTasks = getLocalTasks(projectId, []);
                if (!currentTasks.find(t => t.id === task.id)) {
                    saveLocalTasks(projectId, [...currentTasks, task]);
                    if (onRestoreTask) onRestoreTask(task);
                    showToast("Tâche restaurée", "success");
                }
            };

            onBack(); // On retourne d'abord à la vue projet
            // On affiche le toast APRES le changement de vue pour que le bouton soit accessible
            setTimeout(() => {
                showToast("Tâche supprimée", "info", { label: "Annuler", onClick: handleUndo });
            }, 100);
        }, "Cette action supprimera définitivement la tâche.");
    };

    const handleDateChange = (e) => {
        const val = e.target.value;
        setEditedTask({...editedTask, deadline: val});
        if (val < todayStr) setDateError('Date invalide');
        else setDateError('');
    }

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        const newComment = { id: Date.now(), user: 'Alex', text: commentText, date: 'À l\'instant' };
        setComments([newComment, ...comments]);
        setCommentText('');
    };

    const inputClasses = "w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors";

    return (
        <div className="animate-in flex flex-col h-full max-w-4xl mx-auto w-full pt-4 pb-20">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-blue-600 transition-colors">
                <ArrowLeft size={18} /> Retour au projet (tableau Kanban)
            </button>
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col relative mb-8">
                <div className="p-8 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 pr-4">
                            <input type="text" name="title" value={editedTask.title} onChange={e => setEditedTask({...editedTask, title: e.target.value})} className={`text-2xl font-bold mb-2 ${inputClasses} h-auto py-2`} placeholder="Titre de la tâche" />
                        </div>
                        <div className="flex items-center gap-3">
                            {/* REPLACEMENT DU SELECT */}
                            <StatusSelect 
                                value={editedTask.status} 
                                onChange={(e) => setEditedTask({...editedTask, status: e.target.value})} 
                            />
                            
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                                <Save size={18} /> Sauver
                            </button>
                            
                            {!isNew && (
                                <button onClick={handleDeleteRequest} className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 dark:bg-slate-900/50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-blue-500 font-bold text-lg block tracking-wide">Description</label>
                        <MarkdownEditor 
                            value={editedTask.description || ''} 
                            onChange={e => setEditedTask({...editedTask, description: e.target.value})} 
                            placeholder="Contenu de la tâche (Markdown supporté : # Titre, - Liste, [ ] Checkbox...)"
                        />
                    </div>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-900/30 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex flex-col h-full"><span className="text-slate-400 text-xs font-bold uppercase mb-2 block tracking-wider">Deadline</span>
                    
                        <div className="relative flex-1">
                            <input type="date" min={todayStr} value={editedTask.deadline} onChange={handleDateChange} className={`${inputClasses} w-full ${dateError ? 'border-rose-500 focus:border-rose-500' : ''}`} />
                             {dateError && (
                                <div className="absolute left-0 -bottom-6 text-rose-500 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <AlertTriangle size={12} /> {dateError}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col h-full"><span className="text-slate-400 text-xs font-bold uppercase mb-2 block tracking-wider">Assignée à</span><select value={editedTask.assignee} onChange={e => setEditedTask({...editedTask, assignee: e.target.value})} className={`${inputClasses} flex-1`}>{users.map(u => (<option key={u.id} value={u.name}>{u.name}</option>))}</select></div>
                    <div className="flex flex-col h-full"><span className="text-slate-400 text-xs font-bold uppercase mb-2 block tracking-wider">Créée par</span><input type="text" value={editedTask.creator || 'Admin'} onChange={e => setEditedTask({...editedTask, creator: e.target.value})} className={`${inputClasses} flex-1`} /></div>
                </div>
            </div>

            {!isNew && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8"><MessageSquare className="text-blue-500" size={24} /><h2 className="text-xl font-bold text-slate-800 dark:text-white">Commentaires</h2><span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-sm font-bold text-slate-500">{comments.length}</span></div>
                    <div className="flex gap-4 mb-10"><div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">A</div><div className="flex-1 flex flex-col gap-3"><textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Ajouter un commentaire..." className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 outline-none transition-all resize-none font-medium" rows={3}/><div className="flex justify-end"><button onClick={handleAddComment} disabled={!commentText.trim()} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"><Send size={18} />Envoyer</button></div></div></div>
                    <div className="space-y-8">{comments.map(c => (<div key={c.id} className="flex gap-4 animate-in slide-in-from-bottom-2"><div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-400">{c.user.charAt(0)}</div><div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800"><div className="flex justify-between items-center mb-1"><span className="font-bold text-slate-800 dark:text-white text-sm">{c.user}</span><span className="text-[10px] font-bold text-slate-400 uppercase">{c.date}</span></div><p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{c.text}</p></div></div>))}</div>
                </div>
            )}
        </div>
    );
};

const ProjectDetailView = forwardRef(({ project, onBack, onTaskClick, onCreateTask, users, onProjectUpdate, showToast, onOpenAddMember, openDeleteModal }, ref) => {
    
    // MODIF: Utiliser les tâches de INITIAL_DATA si disponible
    const getInitialTasks = () => {
        const foundProject = INITIAL_DATA.projects.find(p => p.id === project.id);
        return foundProject ? foundProject.tasks : [];
    };

    // MODIF: Utiliser les colonnes de INITIAL_DATA si disponible
    const getInitialColumns = () => {
        const foundProject = INITIAL_DATA.projects.find(p => p.id === project.id);
        return foundProject ? foundProject.columns : ['A Faire', 'En Cours', 'Terminé'];
    };

    const [tasks, setTasks] = useState(() => getLocalTasks(project.id, getInitialTasks()));
    const [columns, setColumns] = useState(() => getLocalColumns(project.id, getInitialColumns()));
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    // Suppression de isAddMemberOpen
    const [newColName, setNewColName] = useState('');
    
    // Ajout des états pour le scroll automatique
    const columnsContainerRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useImperativeHandle(ref, () => ({
        handleUpdateTask: (updatedTask) => setTasks(prev => prev.some(t => t.id === updatedTask.id) ? prev.map(t => t.id === updatedTask.id ? updatedTask : t) : [...prev, updatedTask]),
        handleDeleteTask: (taskId) => setTasks(prev => prev.filter(t => t.id !== taskId))
    }));

    const doneCount = tasks.filter(t => t.status === 'Terminé' || t.status === 'done').length;
    const todoCount = tasks.filter(t => t.status === 'A Faire' || t.status === 'todo').length;
    const doingCount = tasks.filter(t => t.status === 'En Cours' || t.status === 'doing').length;
    const currentProgress = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

    useEffect(() => {
        saveLocalTasks(project.id, tasks);
        saveLocalColumns(project.id, columns);
        onProjectUpdate(project.id, { progress: currentProgress, stats: { todo: todoCount, doing: doingCount, done: doneCount } });
    }, [tasks, columns, project.id, currentProgress, todoCount, doingCount, doneCount]);

    // Effet pour gérer le scroll automatique après l'ajout d'une colonne
    useEffect(() => {
        if (shouldScroll && columnsContainerRef.current) {
            const container = columnsContainerRef.current;
            
            // On attend que le DOM soit totalement peint
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    container.scrollTo({
                        left: container.scrollWidth,
                        behavior: 'smooth'
                    });
                });
            });
            
            setShouldScroll(false);
        }
    }, [columns, shouldScroll]);

    const onDrop = (e, newStatus) => { 
        // FIX: Retrieve using lowercase key 'taskid'
        const taskId = e.dataTransfer.getData("taskid") || e.dataTransfer.getData("taskId"); 
        if (taskId) setTasks(prev => prev.map(t => t.id.toString() === taskId ? { ...t, status: newStatus } : t)); 
    };

    // FIX: Use lowercase keys for setting data
    const onColumnDragStart = (e, colName) => { e.dataTransfer.setData("colname", colName); };
    const onColumnDrop = (e, targetColName) => {
        const sourceColName = e.dataTransfer.getData("colname") || e.dataTransfer.getData("colName");
        if (!sourceColName || sourceColName === targetColName) return;
        const newCols = [...columns];
        const sIdx = newCols.indexOf(sourceColName);
        const tIdx = newCols.indexOf(targetColName);
        newCols.splice(sIdx, 1); newCols.splice(tIdx, 0, sourceColName);
        setColumns(newCols);
    };

    const handleAddColumn = () => {
        if (!newColName.trim() || columns.includes(newColName)) return;
        setColumns([...columns, newColName]); 
        setNewColName(''); 
        setIsAddingColumn(false);
        showToast("Colonne ajoutée avec succès", "success");
        setShouldScroll(true); // Déclenche le scroll
    };

    const handleRenameColumn = (oldName, newName) => {
        if (columns.includes(newName)) return;
        setColumns(cols => cols.map(c => c === oldName ? newName : c));
        // Note: Comme on ne peut renommer que les colonnes vides, pas besoin de migrer les tâches
        showToast("Colonne renommée", "success");
    };

    const handleDeleteColumn = (colName) => {
        openDeleteModal(() => {
            setColumns(cols => cols.filter(c => c !== colName));
            showToast("Colonne supprimée", "success");
        }, `Voulez-vous vraiment supprimer la colonne "${colName}" ?`);
    };

    const availableUsers = users.filter(u => !project.members.includes(u.id));

    return (
        <div className="animate-in flex flex-col h-full">
            <div className="mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={18} /> Retour à l'accueil (tous les projets)
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{project.title}</h1>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold border border-rose-100 dark:border-rose-800">
                                <Clock size={16} /> Deadline : {new Date(project.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">{project.description}</p>
                        <div className="max-w-md"><SatisfyingProgressBar progress={currentProgress} /></div>
                    </div>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-6 pt-2">
                         <div className="space-y-3"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Participants</p>
                             <div className="flex items-center -space-x-3">
                                 {project.members.map((mId) => (
                                     <div key={mId} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shadow-sm relative group cursor-pointer" title={users.find(u => u.id === mId)?.name}>
                                         {users.find(u => u.id === mId)?.name.charAt(0)}
                                     </div>
                                 ))}
                                 <button onClick={onOpenAddMember} className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-white dark:border-slate-900 flex items-center justify-center text-blue-600 shadow-sm hover:bg-blue-100 hover:scale-105 transition-all z-10">
                                     <Plus size={16} />
                                 </button>
                             </div>
                         </div>
                         <div className="space-y-3"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Résumé des tâches</p>
                             <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm w-fit"><StatusCount count={todoCount} color="bg-rose-500" label="À Faire" /><StatusCount count={doingCount} color="bg-amber-400" label="En Cours" /><StatusCount count={doneCount} color="bg-emerald-500" label="Terminé" /></div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-8 pb-6 border-b dark:border-slate-800">
                <button onClick={onCreateTask} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"><Plus size={18} /> Nouvelle tâche</button>
                <div className="relative flex items-center">
                    {isAddingColumn ? (
                        <div className="flex gap-2 animate-in slide-in-from-left-2"><input autoFocus type="text" placeholder="Nom..." className="px-4 py-3 rounded-2xl border-2 dark:bg-slate-900 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white" value={newColName} onChange={e => setNewColName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddColumn()} /><button onClick={handleAddColumn} className="p-3 bg-blue-600 text-white rounded-2xl"><Check size={20} /></button><button onClick={() => setIsAddingColumn(false)} className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 rounded-2xl"><X size={20} /></button></div>
                    ) : (
                        <button onClick={() => setIsAddingColumn(true)} className="px-6 py-3 bg-white dark:bg-slate-800 border-2 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center gap-2 hover:border-blue-500 transition-all"><Layout size={18} /> Nouvelle colonne</button>
                    )}
                </div>
            </div>
            {/* FIX: Use lowercase key 'taskid' in onDragStart */}
            <div className="flex-1 overflow-x-auto pb-10" ref={columnsContainerRef}>
                <div className="flex gap-8 h-full min-w-max items-start">
                    {columns.map(col => (
                        <KanbanColumn 
                            key={col} 
                            title={col} 
                            count={tasks.filter(t => t.status === col).length} 
                            color={col === 'Terminé' || col === 'done' ? 'bg-emerald-500' : col === 'En Cours' || col === 'doing' ? 'bg-amber-400' : 'bg-rose-500'} 
                            tasks={tasks.filter(t => t.status === col)} 
                            status={col} 
                            onDrop={onDrop} 
                            onDragStart={(e, id) => e.dataTransfer.setData("taskid", id)} 
                            onTaskClick={onTaskClick} 
                            onColumnDragStart={onColumnDragStart} 
                            onColumnDrop={onColumnDrop}
                            onRename={handleRenameColumn}
                            onDelete={handleDeleteColumn}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

// --- 7. Barre Latérale ---

const Sidebar = ({ isOpen, onClose, onNavigate, activeView }) => {
    const items = [
        { id: 'dashboard', icon: Folder, label: 'Projets' },
        { id: 'team', icon: Users, label: 'Utilisateurs' },
        { id: 'create_project', icon: PlusCircle, label: 'Nouveau projet' }
    ];
    return (
        <>
            <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex justify-between items-center border-b dark:border-slate-800"><h2 className="font-bold text-2xl dark:text-white">Menu</h2><button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X /></button></div>
                <div className="p-4 space-y-3">{items.map(it => (
                    <button 
                        key={it.id} 
                        onClick={() => { onNavigate(it.id); onClose(); }} 
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeView === it.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <it.icon size={22} /> {it.label}
                    </button>
                ))}</div>
                <div className="absolute bottom-0 w-full p-6 border-t dark:border-slate-800"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">A</div><div><p className="font-bold dark:text-white text-sm">Alexandre</p><p className="text-xs text-slate-500">Admin</p></div></div></div>
            </div>
        </>
    );
};

// --- 8. Application Centrale ---

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success', action: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, onConfirm: null, message: '' });
  
  // États pour les modales déplacées
  const [userModal, setUserModal] = useState({ isOpen: false, userToEdit: null });
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const [currentView, setCurrentView] = useState('dashboard'); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Nouveaux états de filtres par défaut
  const [filters, setFilters] = useState({ 
      progressMin: 0, 
      progressMax: 100, 
      selectedPeople: [], 
      deadlineMin: 0, 
      deadlineMax: 180, 
      showOverdue: true 
  });

  // Sort State
  const [sortConfig, setSortConfig] = useState({ key: 'deadline', direction: 'asc' });

  const activeFiltersCount = 
      (filters.progressMin > 0 ? 1 : 0) + 
      (filters.progressMax < 100 ? 1 : 0) + 
      filters.selectedPeople.length + 
      (filters.deadlineMin > 0 ? 1 : 0) + 
      (filters.deadlineMax < 180 ? 1 : 0) + 
      (!filters.showOverdue ? 1 : 0);

  const isReorderEnabled = searchTerm === '' && activeFiltersCount === 0 && sortConfig.key === 'deadline' && sortConfig.direction === 'asc'; // Désactivé si tri actif autre que défaut ou filtres

  // MODIF: Utilisation directe de INITIAL_DATA.users comme état initial
  const [users, setUsers] = useState(INITIAL_DATA.users);
  
  // MODIF: Initialisation des projets depuis INITIAL_DATA + Calcul stats
  const [projects, setProjects] = useState(() => {
    return INITIAL_DATA.projects.map(p => {
        const tasks = p.tasks || [];
        const doneCount = tasks.filter(t => t.status === 'Terminé' || t.status === 'done').length;
        const todoCount = tasks.filter(t => t.status === 'A Faire' || t.status === 'todo').length;
        const doingCount = tasks.filter(t => t.status === 'En Cours' || t.status === 'doing').length;
        const progress = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
        
        return {
            ...p,
            progress,
            teamCount: p.members.length,
            stats: { todo: todoCount, doing: doingCount, done: doneCount }
        };
    });
  });

  const showToast = (message, type = 'success', action = null) => {
      setToast({ show: true, message, type, action });
  };

  const openDeleteModal = (onConfirm, message) => {
      setDeleteModal({ isOpen: true, onConfirm, message });
  };

  useEffect(() => { 
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const projectDetailRef = useRef();
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Filtrage des données
  let processedProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Filtre Progression
  processedProjects = processedProjects.filter(p => p.progress >= filters.progressMin && p.progress <= filters.progressMax);
  
  // Filtre Membres
  if (filters.selectedPeople.length > 0) {
      processedProjects = processedProjects.filter(p => p.members.some(m => filters.selectedPeople.includes(m)));
  }

  // Filtre Dates (Nouveau logique)
  processedProjects = processedProjects.filter(p => {
      const date = new Date(p.deadline);
      const now = new Date();
      // On met les dates à minuit pour comparer les jours seulement
      date.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);

      const diffTime = date - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
          // Projet en retard
          return filters.showOverdue;
      } else {
          // Projet futur ou aujourd'hui
          return diffDays >= filters.deadlineMin && diffDays <= filters.deadlineMax;
      }
  });

  // Sorting Logic
  processedProjects.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'deadline') {
           aValue = new Date(aValue);
           bValue = new Date(bValue);
      } else if (sortConfig.key === 'title') {
           aValue = aValue.toLowerCase();
           bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
  });


  const handleProjectDragStart = (e, index) => {
      dragItem.current = index;
      e.dataTransfer.effectAllowed = "move";
      // Petit hack pour cacher l'image fantôme par défaut si on voulait customiser, mais ici on laisse le comportement natif
  };

  const handleProjectDragEnter = (e, index) => {
      dragOverItem.current = index;
  };

  const handleProjectDrop = (e) => {
      e.preventDefault();
      const sourceIndex = dragItem.current;
      const targetIndex = dragOverItem.current;

      if (sourceIndex === null || targetIndex === null || sourceIndex === targetIndex) return;

      const newProjects = [...projects];
      const [movedProject] = newProjects.splice(sourceIndex, 1);
      newProjects.splice(targetIndex, 0, movedProject);
      
      setProjects(newProjects);
      dragItem.current = null;
      dragOverItem.current = null;
  };

  const handleCreateProject = ({ title, description, deadline }) => {
      const newProj = { id: Date.now(), title, description, deadline, progress: 0, teamCount: 1, stats: { todo: 0, doing: 0, done: 0 }, members: ['u1'] };
      setProjects([...projects, newProj]); saveLocalTasks(newProj.id, []); setSelectedProject(newProj); setCurrentView('dashboard');
      showToast("Projet créé avec succès");
  };

  const handleDeleteProject = (project) => {
      openDeleteModal(() => {
          setProjects(prev => prev.filter(p => p.id !== project.id));
          // Nettoyage des données locales associées
          localStorage.removeItem(`tasks_${project.id}`);
          localStorage.removeItem(`columns_${project.id}`);
          showToast("Projet supprimé", "success");
      }, `Supprimer définitivement le projet "${project.title}" ?`);
  };

  const handleAddUser = ({ name, role }) => {
      const newUser = { id: `u${Date.now()}`, name, role };
      setUsers([...users, newUser]);
      showToast("Membre ajouté à l'équipe", "success");
  };

  const handleEditUser = (updatedUser) => {
      setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
      showToast("Profil mis à jour", "success");
  };

  // Gestionnaire de sauvegarde pour UserModal (centralisé)
  const handleUserModalSave = (userData) => {
      if (userData.id) {
          handleEditUser(userData);
      } else {
          handleAddUser(userData);
      }
  };

  const handleDeleteUser = (user) => {
      if (user.id === 'u1') {
          showToast("Impossible de supprimer votre propre compte", "error");
          return;
      }
      openDeleteModal(() => {
          setUsers(users.filter(u => u.id !== user.id));
          showToast("Membre retiré de l'équipe", "success");
      }, `Retirer ${user.name} de l'équipe ?`);
  };

  const handleAddMemberToProject = (userId) => {
      if (!selectedProject) return;
      
      const newMembers = [...selectedProject.members, userId];
      // Mise à jour de l'état local des projets
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, members: newMembers } : p));
      // Mise à jour du projet sélectionné
      setSelectedProject(prev => ({ ...prev, members: newMembers }));
      
      showToast("Membre ajouté au projet", "success");
      setAddMemberModalOpen(false);
  };

  const handleNavigate = (v) => {
      if(v === 'create_project') {
          setCurrentView('create_project');
          setSelectedProject(null);
          setSelectedTask(null);
      } else {
          setCurrentView(v); // 'dashboard' or 'team'
          setSelectedProject(null);
          setSelectedTask(null);
      }
  };

  const content = currentView === 'create_project' ? <CreateProjectView onSave={handleCreateProject} onCancel={() => setCurrentView('dashboard')} />
                : currentView === 'team' ? <UserManagementView users={users} projects={projects} onOpenUserModal={(user) => setUserModal({ isOpen: true, userToEdit: user })} onDeleteUser={handleDeleteUser} />
                : selectedTask ? <TaskDetailView task={selectedTask} projectId={selectedProject.id} onBack={() => setSelectedTask(null)} onUpdateTask={(t) => { setSelectedTask(t); projectDetailRef.current?.handleUpdateTask(t); }} onRestoreTask={(t) => projectDetailRef.current?.handleUpdateTask(t)} users={users} showToast={showToast} openDeleteModal={openDeleteModal} />
                : selectedProject ? <ProjectDetailView ref={projectDetailRef} project={selectedProject} onBack={() => setSelectedProject(null)} onTaskClick={(t) => setSelectedTask(t)} onCreateTask={() => setSelectedTask({ id: null, title: '', description: '', status: 'A Faire', priority: 'Medium', assignee: 'Alex', deadline: '2026-01-30', creator: 'Admin', comments: [] })} users={users} showToast={showToast} onOpenAddMember={() => setAddMemberModalOpen(true)} openDeleteModal={openDeleteModal} onProjectUpdate={(id, data) => {
                    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
                    if (selectedProject && selectedProject.id === id) {
                        setSelectedProject(prev => ({ ...prev, ...data }));
                    }
                }} />
                : (
          <div className="flex-1 flex flex-col animate-in">
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div><h1 className="text-4xl md:text-5xl font-light text-slate-400 dark:text-slate-500 tracking-tight mb-2">Hello <span className="font-bold text-slate-800 dark:text-white">Alex!</span></h1><p className="text-xl text-blue-600 dark:text-blue-400 font-medium">Voici tes projets</p></div>
                <button onClick={() => setCurrentView('create_project')} className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"><PlusCircle size={20} /> Nouveau projet</button>
            </div>
            <div className="flex gap-4 mb-8">
                <div className="relative flex-1 group">
                    <input type="text" placeholder="Rechercher un projet..." className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white outline-none focus:border-blue-500 transition-all shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                </div>
                    <div className="flex items-center gap-2">
                    
                    {/* MENU DE TRI EXTÉRIEUR */}
                    <SortControl sortConfig={sortConfig} onSortChange={setSortConfig} />

                    <button 
                        onClick={() => setIsFilterOpen(true)} 
                        className={`p-4 border-2 rounded-2xl transition-all shadow-sm relative ${activeFiltersCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white hover:text-blue-500'}`}
                        title="Filtres"
                    >
                        <Filter />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-in zoom-in">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                    {activeFiltersCount > 0 && (
                        <button onClick={() => setFilters({ progressMin: 0, progressMax: 100, selectedPeople: [], deadlineMin: 0, deadlineMax: 180, showOverdue: true })} className="p-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-colors animate-in fade-in slide-in-from-left-2" title="Effacer les filtres">
                            <X size={24} />
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                {processedProjects.map((p, index) => (
                    <ProjectCard 
                        key={p.id} 
                        {...p} 
                        onClick={() => setSelectedProject(p)} 
                        onDelete={() => handleDeleteProject(p)}
                        draggable={isReorderEnabled}
                        onDragStart={(e) => isReorderEnabled && handleProjectDragStart(e, index)}
                        onDragOver={(e) => isReorderEnabled && (e.preventDefault(), handleProjectDragEnter(e, index))}
                        onDrop={(e) => isReorderEnabled && handleProjectDrop(e)}
                    />
                ))}
            </div>
          </div>
      );

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-950">
        <style>{`
            ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; } .dark ::-webkit-scrollbar-thumb { background: #334155; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-in { animation: fadeIn 0.3s ease-out forwards; }
        `}</style>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={handleNavigate} activeView={currentView} />
      <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
        <header className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95">
                    <Menu size={28} />
                </button>
                <button onClick={() => handleNavigate('dashboard')} className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-slate-600 dark:text-slate-300" title="Accueil">
                    <Home size={24} />
                </button>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 dark:border-slate-700 shadow-sm transition-all">
                {isDarkMode ? <Sun className="text-amber-400" /> : <Moon />}
            </button>
        </header>
        
        <main className="flex-1 flex flex-col">
            {content}
        </main>

        <footer className="mt-20 py-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                &copy; 2026 Project Dashboard. Tous droits réservés.
            </p>
            <div className="flex justify-center gap-6 mt-2">
                <a href="#" className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mentions légales</a>
                <a href="#" className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Politique de confidentialité</a>
                <a href="#" className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a>
            </div>
        </footer>

        <ProjectFilterModal 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
            onApply={setFilters} 
            currentFilters={filters} 
            usersList={users} 
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
        />
        
        {/* Modales globales */}
        <UserModal 
            isOpen={userModal.isOpen} 
            onClose={() => setUserModal({ isOpen: false, userToEdit: null })} 
            onSave={handleUserModalSave} 
            userToEdit={userModal.userToEdit} 
        />
        
        <AddMemberModal 
            isOpen={addMemberModalOpen} 
            onClose={() => setAddMemberModalOpen(false)} 
            onAdd={handleAddMemberToProject} 
            availableUsers={selectedProject ? users.filter(u => !selectedProject.members.includes(u.id)) : []} 
        />

        <DeleteConfirmationModal 
            isOpen={deleteModal.isOpen} 
            onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
            onConfirm={() => {
                if (deleteModal.onConfirm) deleteModal.onConfirm();
                setDeleteModal({ ...deleteModal, isOpen: false });
            }}
            message={deleteModal.message}
        />
        <Toast show={toast.show} message={toast.message} type={toast.type} action={toast.action} onClose={() => setToast({ ...toast, show: false })} />
      </div>
    </div>
  );
}
