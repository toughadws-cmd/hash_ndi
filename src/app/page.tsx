'use client';

import React, { useState, useEffect, useRef } from 'react';

// Configurações do Mentor
const MENTOR_WHATSAPP = "5511999999999"; 
const MENTOR_EMAIL = "mentor@hashndi.com"; 

const ASCII_ART = `  __________________________________________________________________________
 /                                                                          \\
|  <CODE>                                                        [$$$ MRR]   |
|   ██╗  ██╗ █████╗ ███████╗██╗  ██╗  |  ███╗   ██╗██████╗ ██╗    /\\  /\\     |
|   ██║  ██║██╔══██╗██╔════╝██║  ██║  |  ████╗  ██║██╔══██╗██║   /  \\/  \\    |
|   ███████║███████║███████╗███████║  +  ██╔██╗ ██║██║  ██║██║  /   $$   \\   |
|   ██╔══██║██╔══██║╚════██║██╔══██║  |  ██║╚██╗██║██║  ██║██║ /   $$$$   \\  |
|   ██║  ██║██║  ██║███████║██║  ██║  |  ██║ ╚████║██████╔╝██║/   $$$$$$   \\ |
|   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝  |  ╚═╝  ╚═══╝╚═════╝ ╚═╝\\____________/ |
|  </CODE>                                                       [SaaS & IA] |
 \\__________________________________________________________________________/`;

const MANIFESTO_TEXT = `[MANIFESTO DETECTADO]
SaaS e Inteligência Artificial não são apenas tecnologias, são alavancas de liberdade.
Nossos membros constroem ativos digitais reais, criam fluxos de receita recorrente mensal (MRR)
e integram agentes autônomos para escalar operações globais. 
Esta comunidade é o catalisador para desenvolvedores que buscam se tornar founders e 
profissionais de marketing digital que dominam o code de conversão.
Protocolo de nivelamento carregado.`;

interface Question {
  id: number;
  type: 'radio' | 'checkbox' | 'text' | 'textarea' | 'vsl';
  question: string;
  options?: string[];
  required: boolean;
  condition?: (answers: Record<number, any>) => boolean;
}

const questionsList: Question[] = [
  {
    id: 1,
    type: 'radio',
    question: 'Você já conhece a comunidade Network dos Irmãos (NDI)?',
    options: ['Sim', 'Não'],
    required: true
  },
  {
    id: 2,
    type: 'radio',
    question: 'Você já é Membro Oficial do NDI?',
    options: ['Sim', 'Não'],
    required: true,
    condition: (answers) => answers[1] === 'Sim'
  },
  {
    id: 3,
    type: 'vsl',
    question: 'Descriptografando mensagem inicial do Protocolo VSL...',
    required: true,
    condition: (answers) => answers[1] === 'Não'
  },
  {
    id: 4,
    type: 'text',
    question: 'Para iniciar, como você se chama?',
    required: true
  },
  {
    id: 5,
    type: 'text',
    question: 'Qual o seu @instagram?',
    required: true
  },
  {
    id: 6,
    type: 'radio',
    question: 'Qual seu nível de experiência técnica hoje?',
    options: ['Zero', 'Iniciante', 'Intermediário', 'Avançado'],
    required: true
  },
  {
    id: 7,
    type: 'checkbox',
    question: 'Quais áreas você utiliza no seu dia a dia?',
    options: ['No-Code', 'Automações/Low-Code', 'Front-end', 'Back-end/DB', 'APIs de IA', 'Nenhuma'],
    required: true
  },
  {
    id: 8,
    type: 'textarea',
    question: 'Quais ferramentas e linguagens exatas você mais domina?',
    required: true
  },
  {
    id: 9,
    type: 'radio',
    question: 'Você já possui um SaaS ativo?',
    options: ['Já fatura', 'Construindo MVP', 'Só tenho ideia', 'Quero descobrir'],
    required: true
  },
  {
    id: 10,
    type: 'textarea',
    question: 'Se você já tem ou pensou em um SaaS, descreva-o brevemente (Opcional):',
    required: false
  },
  {
    id: 11,
    type: 'textarea',
    question: 'O que você mais busca na HASH_NDI?',
    required: true
  },
  {
    id: 12,
    type: 'text',
    question: 'Quanto tempo semanal você tem disponível para investir na construção do seu SaaS?',
    required: true
  }
];

// Helper para efeito de digitação progressiva acelerada e sutil (estilo terminal hacker)
function runScrambleText(
  targetText: string,
  onUpdate: (current: string) => void,
  onComplete?: () => void,
  options: {
    duration?: number;
    chars?: string;
    cursor?: string;
  } = {}
) {
  const cursor = options.cursor || "░▒▓█";
  const length = targetText.length;
  if (length === 0) {
    onUpdate("");
    onComplete?.();
    return () => {};
  }
  
  // Duração dinâmica baseada no tamanho do texto se não fornecida
  const baseSpeed = 10; // ms por caractere
  const duration = options.duration !== undefined 
    ? options.duration 
    : Math.min(1800, Math.max(300, length * baseSpeed));
  
  const start = performance.now();
  let frameId: number;
  
  const tick = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Curva de aceleração quadrática para digitação progressiva
    const easeProgress = 0.6 * Math.pow(progress, 2) + 0.4 * progress;
    const settledCount = Math.floor(easeProgress * length);
    
    let result = "";
    for (let i = 0; i < length; i++) {
      if (i < settledCount) {
        result += targetText[i];
      } else if (i === settledCount) {
        const cursorChar = cursor[Math.floor(Math.random() * cursor.length)] || "█";
        result += cursorChar;
      } else {
        break; // Oculta caracteres futuros completamente
      }
    }
    
    onUpdate(result);
    
    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
    } else {
      onUpdate(targetText);
      onComplete?.();
    }
  };
  
  frameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frameId);
}

// Helper para animar nós de texto HTML preservando tags e estilizações (spans de cores)
function runDOMScramble(
  element: HTMLElement,
  duration: number = 1000,
  onComplete?: () => void,
  options: {
    chars?: string;
    cursor?: string;
    onUpdate?: () => void;
  } = {}
) {
  const cursor = options.cursor || "░▒▓█";
  
  const textNodes: {
    node: Text;
    originalText: string;
    startIdx: number;
    endIdx: number;
  }[] = [];
  
  let globalLength = 0;
  
  function collectTextNodes(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || "";
      textNodes.push({
        node: node as Text,
        originalText: text,
        startIdx: globalLength,
        endIdx: globalLength + text.length
      });
      globalLength += text.length;
    } else {
      if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        for (let i = 0; i < node.childNodes.length; i++) {
          collectTextNodes(node.childNodes[i]);
        }
      }
    }
  }
  
  collectTextNodes(element);
  
  if (globalLength === 0) {
    onComplete?.();
    return () => {};
  }
  
  textNodes.forEach(item => {
    item.node.nodeValue = "";
  });
  
  const start = performance.now();
  let frameId: number;
  
  const tick = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Curva de aceleração quadrática para digitação progressiva
    const easeProgress = 0.6 * Math.pow(progress, 2) + 0.4 * progress;
    const globalSettledCount = Math.floor(easeProgress * globalLength);
    
    textNodes.forEach(item => {
      let result = "";
      for (let i = 0; i < item.originalText.length; i++) {
        const globalIdx = item.startIdx + i;
        
        if (globalIdx < globalSettledCount) {
          result += item.originalText[i];
        } else if (globalIdx === globalSettledCount) {
          const cursorChar = cursor[Math.floor(Math.random() * cursor.length)] || "█";
          result += cursorChar;
        } else {
          break; // Oculta caracteres futuros completamente
        }
      }
      item.node.nodeValue = result;
    });
    
    options.onUpdate?.();
    
    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
    } else {
      textNodes.forEach(item => {
        item.node.nodeValue = item.originalText;
      });
      options.onUpdate?.();
      onComplete?.();
    }
  };
  
  frameId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frameId);
    textNodes.forEach(item => {
      item.node.nodeValue = item.originalText;
    });
  };
}

interface AnimatedOptionProps {
  text: string;
  prefix: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function AnimatedOption({ text, prefix, onClick, className = "" }: AnimatedOptionProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const stop = runScrambleText(
      text,
      (t) => setDisplayedText(t),
      undefined,
      { duration: 400, cursor: "░▒▓█" }
    );
    return stop;
  }, [text]);

  return (
    <div onClick={onClick} className={className}>
      {prefix}
      <span className="text-[#e2e8f0]">{displayedText}</span>
    </div>
  );
}

export default function Home() {
  // Estados de Fluxo
  const [bootCommand, setBootCommand] = useState('');
  const [showBootCursor, setShowBootCursor] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerTyped, setBannerTyped] = useState('');
  const [manifestoTyped, setManifestoTyped] = useState('');
  const [showManifestoContainer, setShowManifestoContainer] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [showStartBtn, setShowStartBtn] = useState(false);
  
  // Estados do Preloader Hacker
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderFading, setPreloaderFading] = useState(false);
  const [preloaderTitle, setPreloaderTitle] = useState('');
  const [preloaderSubtitle, setPreloaderSubtitle] = useState('');
  const [preloaderGlitchActive, setPreloaderGlitchActive] = useState(false);
  const [showPreloaderCursor, setShowPreloaderCursor] = useState(true);
  const [showSubtitleCursor, setShowSubtitleCursor] = useState(false);
  
  // Novos estados para o comando do preloader
  const [preloaderCmdText, setPreloaderCmdText] = useState('');
  const [showPreloaderCmd, setShowPreloaderCmd] = useState(true);
  const [showPreloaderCmdCursor, setShowPreloaderCmdCursor] = useState(true);
  const [showPreloaderMain, setShowPreloaderMain] = useState(false);
  
  // Novos estados para a introdução do formulário
  const [startedForm, setStartedForm] = useState(false);
  const [applyCmdTyped, setApplyCmdTyped] = useState('');
  const [applyMsg1Typed, setApplyMsg1Typed] = useState('');
  const [applyMsg2Typed, setApplyMsg2Typed] = useState('');
  const [showQuestionsActive, setShowQuestionsActive] = useState(false);
  
  // Novos estados para a compilação final
  const [compiledMsg1, setCompiledMsg1] = useState('');
  const [compiledMsg2, setCompiledMsg2] = useState('');
  const [compiledReport, setCompiledReport] = useState('');
  const [showCompiledActions, setShowCompiledActions] = useState(false);
  
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestionText, setActiveQuestionText] = useState('');
  const [typedQuestionIndex, setTypedQuestionIndex] = useState<number | null>(null);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [inputText, setInputText] = useState('');
  const [textareaText, setTextareaText] = useState('');
  const [checkboxSelections, setCheckboxSelections] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);
  const [summaryReport, setSummaryReport] = useState('');
  
  // Estados para Lead Scoring e Pitch
  const [leadScore, setLeadScore] = useState<number>(0);
  const [leadProfile, setLeadProfile] = useState<string>('');
  
  // Estados do Checkout seguro
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCheckoutMinimized, setIsCheckoutMinimized] = useState(false);
  const [isCheckoutMaximized, setIsCheckoutMaximized] = useState(false);
  const [checkoutPosition, setCheckoutPosition] = useState({ x: 120, y: 80 });
  const [isCheckoutDragging, setIsCheckoutDragging] = useState(false);
  const checkoutDragRef = useRef({ startX: 0, startY: 0, posX: 120, posY: 80 });
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  
  // Dados do Cartão
  const [ccName, setCcName] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');
  const [ccErrors, setCcErrors] = useState<Record<string, string>>({});
  
  // PIX simulation timer
  const [pixTimeLeft, setPixTimeLeft] = useState(600); // 10 minutes
  const pixSimTimerRef = useRef<any>(null);

  // Estados de arrastar (Draggable Window)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });
  
  // Estados da Janela e Desktop
  const [windowOpen, setWindowOpen] = useState(false);
  const [windowMinimized, setWindowMinimized] = useState(false);
  const [windowMaximized, setWindowMaximized] = useState(false);
  const [clockTime, setClockTime] = useState('');
  const [isCrtAnimating, setIsCrtAnimating] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Estados da Janela VSL
  const [isVslWindowOpen, setIsVslWindowOpen] = useState(false);
  const [isVslWindowMinimized, setIsVslWindowMinimized] = useState(false);
  const [isVslWindowMaximized, setIsVslWindowMaximized] = useState(false);
  const [vslPosition, setVslPosition] = useState({ x: 80, y: 50 });
  const [isVslDragging, setIsVslDragging] = useState(false);
  const vslDragRef = useRef({ startX: 0, startY: 0, posX: 80, posY: 50 });

  // Estados e Refs de controle temporizado da VSL
  const [isVslLoading, setIsVslLoading] = useState(true);
  const [isVslLocked, setIsVslLocked] = useState(true);
  const [isVslProceeded, setIsVslProceeded] = useState(false);
  const isVslProceededRef = useRef(false);
  useEffect(() => {
    isVslProceededRef.current = isVslProceeded;
  }, [isVslProceeded]);
  const vslLoadingTimerRef = useRef<any>(null);
  const vslLockTimerRef = useRef<any>(null);

  const clearVslTimers = () => {
    if (vslLoadingTimerRef.current) clearTimeout(vslLoadingTimerRef.current);
    if (vslLockTimerRef.current) clearTimeout(vslLockTimerRef.current);
  };

  const handleCloseVslWindow = () => {
    if (isVslLocked) return;
    clearVslTimers();
    try {
      ytPlayerRef.current?.stopVideo();
    } catch (e) {}
    setIsVslWindowOpen(false);
  };

  // Auto-open VSL window when the question type is VSL
  useEffect(() => {
    const activeQuestion = questionsList[currentQuestionIndex];
    if (activeQuestion && activeQuestion.type === 'vsl' && startedForm) {
      setIsVslLoading(true);
      setIsVslLocked(true);
      setIsVslWindowOpen(true);
      setIsVslWindowMinimized(false);
    }
  }, [currentQuestionIndex, startedForm]);
  
  // Elementos Auxiliares e Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);
  const treeRef = useRef<HTMLDivElement | null>(null);
  const [vslMuted, setVslMuted] = useState(true);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  // Efeito para atualizar o relógio em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('pt-BR'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // 1. Matrix Rain Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let fontSize = 14;
    let columns: number[] = [];
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const totalColumns = Math.floor(canvas.width / fontSize);
      columns = Array.from({ length: totalColumns }).map(() => Math.random() * -100);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    const charList = "01$ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$#@<>[]/\\".split("");
    
    const draw = () => {
      ctx.fillStyle = 'rgba(3, 5, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#2bd87a';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < columns.length; i++) {
        const text = charList[Math.floor(Math.random() * charList.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;
        
        ctx.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.985) {
          columns[i] = 0;
        }
        columns[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Dynamic Gutter height calculation
  const updateGutter = () => {
    if (terminalBodyRef.current) {
      const height = terminalBodyRef.current.scrollHeight;
      const totalLines = Math.max(35, Math.ceil(height / 24)); // 24px per line
      const lines = Array.from({ length: totalLines }, (_, idx) => idx + 1);
      setLineNumbers(lines);
    }
  };

  useEffect(() => {
    updateGutter();
  }, [bootCommand, showBanner, manifestoTyped, showTree, showStartBtn, startedForm, history, activeQuestionText, currentQuestionIndex, isCompiled]);

  // Auto-scroll inside terminal container
  const autoScroll = () => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
      updateGutter();
    }, 50);
  };

  // Efeito de controle do Preloader Hacker com Scramble Text
  useEffect(() => {
    const cmdText = "npm run hashman";
    const titleText = "HASHMAN + NDI";
    const subtitleText = "SaaS e IA";
    
    // 1. Digita o comando "npm run hashman"
    const stopCmdScramble = runScrambleText(
      cmdText,
      (text) => setPreloaderCmdText(text),
      () => {
        // Quando termina de digitar o comando:
        setTimeout(() => {
          setShowPreloaderCmdCursor(false);
          setShowPreloaderMain(true);
          
          // Espera um pouco e oculta a linha de comando para focar no título
          setTimeout(() => {
            setShowPreloaderCmd(false);
          }, 300);
          
          // 2. Inicia o scramble do título
          runScrambleText(
            titleText,
            (text) => setPreloaderTitle(text),
            () => {
              setShowPreloaderCursor(false);
              setPreloaderGlitchActive(true); // Ativa glitch no título
              
              // 3. Espera 1 segundo com glitch e inicia scramble do subtítulo
              setTimeout(() => {
                setShowSubtitleCursor(true);
                runScrambleText(
                  subtitleText,
                  (text) => setPreloaderSubtitle(text),
                  () => {
                    // 4. Espera 1.2 segundos e inicia fade out
                    setTimeout(() => {
                      setShowSubtitleCursor(false);
                      setPreloaderFading(true);
                      
                      // 5. Tempo do fade out CSS (600ms) antes de remover o preloader
                      setTimeout(() => {
                        setPreloaderVisible(false);
                        setWindowOpen(true);
                        setIsCrtAnimating(true);
                      }, 600);
                    }, 1200);
                  },
                  { duration: 600, cursor: "░▒▓█" }
                );
              }, 1000);
            },
            { duration: 1000, cursor: "░▒▓█" }
          );
        }, 400); // tempo de simulação de "enter"
      },
      { duration: 1000, cursor: "░▒▓█" }
    );
    
    return () => {
      stopCmdScramble();
    };
  }, []);

  // 3. Simulated Command Boot sequence com Scramble
  useEffect(() => {
    if (preloaderVisible) return; // Só inicia o boot após o término do preloader
    
    const commandText = "cat README.md";
    
    // Scramble para digitar o comando cat README.md
    const stopCmdScramble = runScrambleText(
      commandText,
      (text) => setBootCommand(text),
      () => {
        setShowBootCursor(false);
        // Show banner ASCII
        setTimeout(() => {
          setShowBanner(true);
          // Inicia digitação rápida da arte ASCII
          runScrambleText(
            ASCII_ART,
            (text) => {
              setBannerTyped(text);
              autoScroll();
            },
            () => {
              autoScroll();
              // Print Manifesto
              setTimeout(() => {
                setShowManifestoContainer(true);
                
                // Digitação do manifesto
                runScrambleText(
                  MANIFESTO_TEXT,
                  (text) => {
                    setManifestoTyped(text);
                    autoScroll();
                  },
                  () => {
                    // Show directory tree feature
                    setTimeout(() => {
                      setShowTree(true);
                      autoScroll();
                    }, 400);
                  },
                  { duration: 1500 }
                );
              }, 400);
            },
            { duration: 800 }
          );
        }, 300);
      },
      { duration: 800, cursor: "░▒▓█" }
    );
    
    return () => {
      stopCmdScramble();
    };
  }, [preloaderVisible]);

  // Efeito para animar a árvore de diretórios quando ela for montada
  useEffect(() => {
    if (showTree && treeRef.current) {
      const stopTreeScramble = runDOMScramble(
        treeRef.current,
        1200,
        () => {
          // Show "Start Application" button
          setTimeout(() => {
            setShowStartBtn(true);
            autoScroll();
          }, 300);
        },
        { onUpdate: autoScroll }
      );
      return () => stopTreeScramble();
    }
  }, [showTree]);

  // 4. Keyboard option selections (A, B, C...) for radio/checkbox questions
  useEffect(() => {
    const activeQuestion = questionsList[currentQuestionIndex];
    if (!activeQuestion || !startedForm || isCompiled) return;
    
    const handleKeySelect = (e: KeyboardEvent) => {
      if (typedQuestionIndex !== currentQuestionIndex) return;
      if (activeQuestion.type === 'radio' && activeQuestion.options) {
        const char = e.key.toUpperCase();
        const index = char.charCodeAt(0) - 65; // A=0, B=1, etc.
        if (index >= 0 && index < activeQuestion.options.length) {
          submitAnswer(activeQuestion, activeQuestion.options[index]);
        }
      } else if (activeQuestion.type === 'checkbox' && activeQuestion.options) {
        if (e.key === 'Enter') {
          submitAnswer(activeQuestion, checkboxSelections);
        } else {
          const char = e.key.toUpperCase();
          const index = char.charCodeAt(0) - 65;
          if (index >= 0 && index < activeQuestion.options.length) {
            const opt = activeQuestion.options[index];
            setCheckboxSelections((prev) => 
              prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
            );
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeySelect);
    return () => window.removeEventListener('keydown', handleKeySelect);
  }, [startedForm, currentQuestionIndex, checkboxSelections, isCompiled, typedQuestionIndex]);

  // 5. Dynamic Scramble for questions
  const runQuestionTypewriter = (text: string, onComplete?: () => void) => {
    runScrambleText(
      text,
      (txt) => {
        setActiveQuestionText(txt);
        autoScroll();
      },
      () => {
        autoScroll();
        onComplete?.();
      },
      { duration: 600, cursor: "░▒▓█" }
    );
  };

  // Render question handler
  useEffect(() => {
    if (!showQuestionsActive || isCompiled) return;
    
    const activeQuestion = questionsList[currentQuestionIndex];
    if (!activeQuestion) {
      compileFinalReport();
      return;
    }
    
    // Check conditional matching
    if (activeQuestion.condition && !activeQuestion.condition(userAnswers)) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }
    
    // Run Typewriter
    runQuestionTypewriter(activeQuestion.question, () => {
      setTypedQuestionIndex(currentQuestionIndex);
    });
    
    // Reset values
    setInputText('');
    setTextareaText('');
    setCheckboxSelections([]);
    setShowError(false);
  }, [showQuestionsActive, currentQuestionIndex]);

  // Start Form handler
  const handleStartForm = () => {
    setShowStartBtn(false);
    setStartedForm(true);
    autoScroll();
  };

  // Sequência de digitação do cabeçalho do formulário
  useEffect(() => {
    if (!startedForm) return;
    
    runScrambleText(
      "./apply_hash.sh",
      (text) => {
        setApplyCmdTyped(text);
        autoScroll();
      },
      () => {
        setTimeout(() => {
          runScrambleText(
            "Iniciando protocolo de aplicação HASH + NDI...",
            (text) => {
              setApplyMsg1Typed(text);
              autoScroll();
            },
            () => {
              setTimeout(() => {
                runScrambleText(
                  "Carregando sistema de perguntas do terminal. Digite as respostas ou selecione as opções.",
                  (text) => {
                    setApplyMsg2Typed(text);
                    autoScroll();
                  },
                  () => {
                    setTimeout(() => {
                      setShowQuestionsActive(true);
                      autoScroll();
                    }, 200);
                  },
                  { duration: 800 }
                );
              }, 200);
            },
            { duration: 500 }
          );
        }, 200);
      },
      { duration: 600 }
    );
  }, [startedForm]);

  // 6. YouTube VSL Setup (API injection)
  useEffect(() => {
    if (isVslWindowOpen) {
      // Check if YouTube Script is present
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
      
      const checkAndCreate = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          if (playerWrapperRef.current) {
            clearInterval(checkAndCreate);
            
            // Clear wrapper and create dynamic player element to shield it from React reconciliation
            playerWrapperRef.current.innerHTML = '';
            const targetDiv = document.createElement('div');
            playerWrapperRef.current.appendChild(targetDiv);
            
            ytPlayerRef.current = new (window as any).YT.Player(targetDiv, {
              height: '100%',
              width: '100%',
              videoId: 'dYUDXp9eL4A',
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                mute: 1,
                enablejsapi: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : ''
              },
              events: {
                'onReady': (event: any) => {
                  if (isVslProceededRef.current) {
                    setIsVslLoading(false);
                    setIsVslLocked(false);
                    try {
                      event.target.unMute();
                      event.target.playVideo();
                      setVslMuted(false);
                    } catch (e) {}
                  } else {
                    // Inicia sequência temporizada
                    setIsVslLoading(true);
                    setIsVslLocked(true);
                    
                    vslLoadingTimerRef.current = setTimeout(() => {
                      setIsVslLoading(false);
                      try {
                        event.target.unMute();
                        event.target.playVideo();
                        setVslMuted(false);
                      } catch (e) {}
                      
                      vslLockTimerRef.current = setTimeout(() => {
                        setIsVslLocked(false);
                      }, 5000);
                    }, 1000);
                  }
                }
              }
            });
          }
        }
      }, 200);
      
      return () => {
        clearInterval(checkAndCreate);
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch(e) {}
          ytPlayerRef.current = null;
        }
        clearVslTimers();
      };
    }
  }, [isVslWindowOpen]);

  const toggleVslAudio = () => {
    if (isVslLocked) return;
    const player = ytPlayerRef.current;
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      setVslMuted(false);
    } else {
      player.mute();
      setVslMuted(true);
    }
  };

  const handleVslProceed = () => {
    clearVslTimers();
    setIsVslProceeded(true);
    // Do not close the VSL window on proceed (user request)
    // setIsVslWindowOpen(false);
    submitAnswer(questionsList[currentQuestionIndex], "VSL Assistida");
  };

  // Submit Active Answer
  const submitAnswer = (q: Question, val: any) => {
    // Check validation
    if (q.required && (!val || (Array.isArray(val) && val.length === 0))) {
      setShowError(true);
      autoScroll();
      return;
    }
    
    setShowError(false);
    
    // Hide active inputs immediately
    setTypedQuestionIndex(null);
    
    // Start loading bar animation before loading next question
    setIsProcessingAnswer(true);
    setProcessingProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setProcessingProgress(100);
        
        setTimeout(() => {
          setIsProcessingAnswer(false);
          setProcessingProgress(0);
          
          // Save to answers list
          setUserAnswers((prev) => ({ ...prev, [q.id]: val }));
          
          // Append to logs history
          const displayVal = Array.isArray(val) ? val.join(', ') : val;
          setHistory((prev) => [...prev, { question: q.question, answer: displayVal }]);
          
          // Advance index
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 150);
      } else {
        setProcessingProgress(progress);
        autoScroll();
      }
    }, 45); // ~450ms loading animation
  };

  const calculateLeadScore = (answers: Record<number, any>): number => {
    let score = 0;
    
    // Q6: Experiência Técnica
    const exp = answers[6];
    if (exp === 'Zero') score += 10;
    else if (exp === 'Iniciante') score += 20;
    else if (exp === 'Intermediário') score += 30;
    else if (exp === 'Avançado') score += 40;
    
    // Q7: Áreas
    const areas = answers[7] || [];
    if (Array.isArray(areas)) {
      if (areas.includes('Nenhuma')) {
        score += 5;
      } else {
        const areaScore = areas.filter(a => a !== 'Nenhuma').length * 7;
        score += Math.min(30, areaScore);
      }
    }
    
    // Q9: SaaS
    const saas = answers[9];
    if (saas === 'Já fatura') score += 30;
    else if (saas === 'Construindo MVP') score += 25;
    else if (saas === 'Só tenho ideia') score += 15;
    else if (saas === 'Quero descobrir') score += 10;
    
    return score;
  };

  const getPersonalizedPitch = (score: number) => {
    if (score >= 75) {
      return {
        profile: 'Elite Founder',
        color: '#ffbd2e',
        badge: 'ELITE-FOUNDER-ACTIVE',
        focus: 'Escala, Networking e Multiplicação com SaaS + IA',
        text: 'Você demonstrou alto potencial de execução técnica e visão avançada de mercado. Founders com o seu perfil costumam enfrentar gargalos de escala, networking qualificado com outros fundadores e acesso a códigos e boilerplates que aceleram a infraestrutura dos seus sistemas. Na HASH_NDI e Comunidade NDI, você se conectará diretamente a quem está faturando alto com SaaS, acessará arquiteturas avançadas de IA e infra pronta para multiplicar seu faturamento.'
      };
    } else if (score >= 45) {
      return {
        profile: 'Solopreneur / Construtor Ativo',
        color: '#57a5e5',
        badge: 'SOLOPRENEUR-ACTIVE-BUILDER',
        focus: 'Lançamento Acelerado e Monetização do MVP',
        text: 'Você está na fase de maior aceleração: tirando a ideia do papel e construindo seu MVP. O seu principal gargalo hoje é o tempo e o foco em implementar as integrações corretas (gateways de pagamento, fluxos de IA, autenticação). Na HASH_NDI e Comunidade NDI, nós te fornecemos os templates Next.js prontos de alta conversão, tutoriais de automações e o feedback de uma comunidade ativa para você lançar e validar seu SaaS em tempo recorde.'
      };
    } else {
      return {
        profile: 'Aspiring Founder / Futuro Fundador',
        color: '#ff5f56',
        badge: 'ASPIRING-FOUNDER-INITIATE',
        focus: 'Do Zero ao Primeiro MVP SaaS Validado',
        text: 'Você está iniciando sua jornada rumo à liberdade digital e à criação do seu primeiro SaaS. Não se preocupe se não tem ampla experiência técnica: o ecossistema atual de low-code/no-code e inteligência artificial nivelou o jogo. Na HASH_NDI e Comunidade NDI, você terá o passo a passo absoluto do zero, templates copiáveis, tutoriais práticos e o suporte de membros seniores para validar e criar seu primeiro ativo digital recorrente.'
      };
    }
  };

  // 7. Final Report Compilation
  const compileFinalReport = () => {
    setIsCompiled(true);
    
    // Calcular Lead Score e definir perfil
    const score = calculateLeadScore(userAnswers);
    setLeadScore(score);
    const pitchData = getPersonalizedPitch(score);
    setLeadProfile(pitchData.profile);
    
    let report = `======================================================================
                 DIAGNÓSTICO DA APLICAÇÃO HASH + NDI
======================================================================
DATA DA COMPILAÇÃO: ${new Date().toLocaleString('pt-BR')}
SISTEMA DE SEGURANÇA: PROTOCOLO ATIVO
SCORE DE EXECUÇÃO: ${score}/100 [PERFIL: ${pitchData.profile.toUpperCase()}]
======================================================================

`;

    questionsList.forEach((q) => {
      // Skip unsatisfied conditionals
      if (q.condition && !q.condition(userAnswers)) return;
      
      let answerText = "Não informado";
      const val = userAnswers[q.id];
      if (val) {
        answerText = Array.isArray(val) ? val.join(', ') : val;
      }
      
      report += `[PERGUNTA ${String(q.id).padStart(2, '0')}] ${q.question}\n`;
      report += `>> RESPOSTA: ${answerText}\n`;
      report += `----------------------------------------------------------------------\n`;
    });
    
    report += `[FIM DO RELATÓRIO - COMPILADO VIA HASH_NDI ENGINE v1.0.2]`;
    setSummaryReport(report);
    
    // Inicia a digitação animada sequencial da tela final
    runScrambleText(
      "[ COMPILED ] Processando dados de aplicação HASH_NDI...",
      (text) => {
        setCompiledMsg1(text);
        autoScroll();
      },
      () => {
        setTimeout(() => {
          runScrambleText(
            `[ OK ] Aplicação compilada com sucesso. Score: ${score}/100. Relatório de Diagnóstico gerado.`,
            (text) => {
              setCompiledMsg2(text);
              autoScroll();
            },
            () => {
              setTimeout(() => {
                runScrambleText(
                  report,
                  (text) => {
                    setCompiledReport(text);
                    autoScroll();
                  },
                  () => {
                    setShowCompiledActions(true);
                    autoScroll();
                  },
                  { duration: 1500 }
                );
              }, 300);
            },
            { duration: 600 }
          );
        }, 300);
      },
      { duration: 600 }
    );
  };

  // Share Actions
  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(summaryReport);
    window.open(`https://wa.me/${MENTOR_WHATSAPP}?text=${encoded}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Aplicação da HASH + NDI - Relatório");
    const body = encodeURIComponent(summaryReport);
    window.location.href = `mailto:${MENTOR_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(summaryReport).then(() => {
      const copyBtn = document.getElementById('react-copy-btn');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "[ COPIADO COM SUCESSO! ]";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    }).catch(() => {
      alert("Erro ao copiar. Por favor selecione e copie diretamente do terminal.");
    });
  };

  // Draggable Window Logic (Mouse + Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || windowMaximized) return; // Só arrasta com clique esquerdo se não estiver maximizado
    setIsDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.posX = position.x;
    dragRef.current.posY = position.y;
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || windowMaximized) return; // Só arrasta se não estiver maximizado
    setIsDragging(true);
    dragRef.current.startX = e.touches[0].clientX;
    dragRef.current.startY = e.touches[0].clientY;
    dragRef.current.posX = position.x;
    dragRef.current.posY = position.y;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.posX + dx,
        y: dragRef.current.posY + dy
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.posX + dx,
        y: dragRef.current.posY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // VSL Draggable Window Logic (Mouse + Touch)
  const handleVslMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isVslWindowMaximized) return;
    setIsVslDragging(true);
    vslDragRef.current.startX = e.clientX;
    vslDragRef.current.startY = e.clientY;
    vslDragRef.current.posX = vslPosition.x;
    vslDragRef.current.posY = vslPosition.y;
    e.preventDefault();
  };

  const handleVslTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || isVslWindowMaximized) return;
    setIsVslDragging(true);
    vslDragRef.current.startX = e.touches[0].clientX;
    vslDragRef.current.startY = e.touches[0].clientY;
    vslDragRef.current.posX = vslPosition.x;
    vslDragRef.current.posY = vslPosition.y;
  };

  useEffect(() => {
    if (!isVslDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - vslDragRef.current.startX;
      const dy = e.clientY - vslDragRef.current.startY;
      setVslPosition({
        x: vslDragRef.current.posX + dx,
        y: vslDragRef.current.posY + dy
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - vslDragRef.current.startX;
      const dy = e.touches[0].clientY - vslDragRef.current.startY;
      setVslPosition({
        x: vslDragRef.current.posX + dx,
        y: vslDragRef.current.posY + dy
      });
    };

    const handleMouseUp = () => {
      setIsVslDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isVslDragging]);

  // Checkout Draggable Window Logic (Mouse + Touch)
  const handleCheckoutMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isCheckoutMaximized) return;
    setIsCheckoutDragging(true);
    checkoutDragRef.current.startX = e.clientX;
    checkoutDragRef.current.startY = e.clientY;
    checkoutDragRef.current.posX = checkoutPosition.x;
    checkoutDragRef.current.posY = checkoutPosition.y;
    e.preventDefault();
  };

  const handleCheckoutTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || isCheckoutMaximized) return;
    setIsCheckoutDragging(true);
    checkoutDragRef.current.startX = e.touches[0].clientX;
    checkoutDragRef.current.startY = e.touches[0].clientY;
    checkoutDragRef.current.posX = checkoutPosition.x;
    checkoutDragRef.current.posY = checkoutPosition.y;
  };

  useEffect(() => {
    if (!isCheckoutDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - checkoutDragRef.current.startX;
      const dy = e.clientY - checkoutDragRef.current.startY;
      setCheckoutPosition({
        x: checkoutDragRef.current.posX + dx,
        y: checkoutDragRef.current.posY + dy
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - checkoutDragRef.current.startX;
      const dy = e.touches[0].clientY - checkoutDragRef.current.startY;
      setCheckoutPosition({
        x: checkoutDragRef.current.posX + dx,
        y: checkoutDragRef.current.posY + dy
      });
    };

    const handleMouseUp = () => {
      setIsCheckoutDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isCheckoutDragging]);

  // PIX countdown and simulated approval
  useEffect(() => {
    if (isCheckoutOpen && checkoutPaymentMethod === 'pix' && checkoutStatus === 'idle') {
      pixSimTimerRef.current = setInterval(() => {
        setPixTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(pixSimTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Auto-approve PIX after 15 seconds for realistic simulation flow
      const autoApproveTimer = setTimeout(() => {
        if (isCheckoutOpen && checkoutPaymentMethod === 'pix') {
          setCheckoutStatus('processing');
          setTimeout(() => {
            setCheckoutStatus('success');
          }, 2000);
        }
      }, 15000);

      return () => {
        clearInterval(pixSimTimerRef.current);
        clearTimeout(autoApproveTimer);
      };
    }
  }, [isCheckoutOpen, checkoutPaymentMethod, checkoutStatus]);

  return (
    <main className="relative w-screen h-screen text-[#e2e8f0] overflow-hidden font-mono select-none flex flex-col justify-between">
      
      {/* Styles Injetados (Glitch e visual CRT) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .desktop-wallpaper {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(circle at 80% 20%, rgba(87, 165, 229, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(43, 216, 122, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(10, 15, 30, 0.5) 0%, transparent 100%),
            #070b13;
          z-index: -20;
        }

        /* Scanlines scan */
        .react-scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
          z-index: 50;
          opacity: 0.4;
        }

        /* Screen Grid lines */
        .react-grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image: 
            linear-gradient(to right, rgba(43, 216, 122, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 216, 122, 0.02) 1px, transparent 1px);
          background-size: 20px 20px;
          z-index: 45;
        }

        /* Blinking cursor */
        .react-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background-color: #2bd87a;
          margin-left: 4px;
          animation: react-blink 0.8s infinite;
          vertical-align: middle;
        }

        @keyframes react-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Hide scrollbar utility */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Gutter lines */
        .react-gutter-line {
          line-height: 1.5rem;
          height: 1.5rem;
          text-align: right;
          padding-right: 0.75rem;
          color: #6272a4;
          opacity: 0.5;
        }
        
        /* ASCII Glitch animations */
        .react-glitch-container {
          position: relative;
          display: inline-block;
        }

        .react-glitch-text {
          color: #2bd87a;
          font-weight: bold;
          line-height: 1.1;
          white-space: pre;
        }

        .react-glitch-text::before,
        .react-glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #03050a;
        }

        .react-glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #ff5f56;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }

        .react-glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 #57a5e5, 0 1px #ffbd2e;
          clip: rect(85px, 450px, 140px, 0);
          animation: glitch-anim2 5s infinite linear alternate-reverse;
        }

        /* Estilo Glitch do Preloader */
        .preloader-glitch {
          position: relative;
          color: #2bd87a;
        }
        .preloader-glitch::before,
        .preloader-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #03050a;
        }
        .preloader-glitch::before {
          left: 3px;
          text-shadow: -2px 0 #ff5f56;
          clip: rect(24px, 750px, 90px, 0);
          animation: preloader-glitch-anim1 2s infinite linear alternate-reverse;
        }
        .preloader-glitch::after {
          left: -3px;
          text-shadow: -2px 0 #57a5e5, 0 2px #ffbd2e;
          clip: rect(85px, 750px, 140px, 0);
          animation: preloader-glitch-anim2 2s infinite linear alternate-reverse;
        }

        @keyframes preloader-glitch-anim1 {
          0% { clip: rect(40px, 9999px, 60px, 0); }
          20% { clip: rect(12px, 9999px, 85px, 0); }
          40% { clip: rect(75px, 9999px, 115px, 0); }
          60% { clip: rect(5px, 9999px, 45px, 0); }
          80% { clip: rect(95px, 9999px, 135px, 0); }
          100% { clip: rect(25px, 9999px, 70px, 0); }
        }

        @keyframes preloader-glitch-anim2 {
          0% { clip: rect(65px, 9999px, 105px, 0); }
          20% { clip: rect(5px, 9999px, 35px, 0); }
          40% { clip: rect(120px, 9999px, 145px, 0); }
          60% { clip: rect(45px, 9999px, 90px, 0); }
          80% { clip: rect(15px, 9999px, 65px, 0); }
          100% { clip: rect(80px, 9999px, 120px, 0); }
        }

        @keyframes crt-power-on {
          0% {
            transform: scale(0.01, 0.005);
            opacity: 0;
            filter: brightness(3);
          }
          40% {
            transform: scale(1, 0.005);
            opacity: 0.8;
            filter: brightness(2);
          }
          100% {
            transform: scale(1, 1);
            opacity: 1;
            filter: brightness(1);
          }
        }

        .crt-animate-open {
          animation: crt-power-on 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          transform-origin: center;
        }

        @keyframes react-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: react-fade-in 0.2s ease-out forwards;
        }
      `}} />

      {/* Preloader Hacker */}
      {preloaderVisible && (
        <div 
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03050a] transition-opacity duration-500 ease-out select-none ${preloaderFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          {/* Overlay Screen Effects específicos para o preloader */}
          <div className="react-scanlines"></div>
          <div className="react-grid-overlay"></div>
          
          <div className="w-full max-w-4xl px-6 flex flex-col items-center justify-center">
            {showPreloaderCmd && (
              <div className="font-mono text-xl sm:text-2xl text-[#2bd87a] self-start mb-8 pl-4">
                <span className="text-[#57a5e5] font-bold">~/hash_ndi$ </span>
                <span>{preloaderCmdText}</span>
                {showPreloaderCmdCursor && <span className="react-cursor"></span>}
              </div>
            )}
            
            {showPreloaderMain && (
              <div className="flex flex-col items-center justify-center text-center px-4 max-w-full animate-fade-in">
                <div 
                  className={`font-mono font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-widest text-[#2bd87a] ${preloaderGlitchActive ? 'preloader-glitch' : ''}`}
                  data-text="HASHMAN + NDI"
                >
                  {preloaderTitle}
                  {showPreloaderCursor && <span className="react-cursor"></span>}
                </div>
                
                <div className="font-mono text-lg sm:text-2xl text-[#6272a4] tracking-wider mt-6 h-8 min-h-[2rem]">
                  {preloaderSubtitle}
                  {showSubtitleCursor && <span className="react-cursor"></span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallpaper estilo Windows 11 */}
      <div className="desktop-wallpaper" />

      {/* Canvas do Matrix Rain */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full object-cover -z-10 opacity-15 pointer-events-none"></canvas>
      
      {/* Efeitos de Scanline e Monitor Antigo */}
      <div className="react-scanlines"></div>
      <div className="react-grid-overlay"></div>

      {/* Ícones do Desktop */}
      <div className="absolute top-6 left-6 flex flex-col gap-6 z-20">
        {/* Icon: Terminal */}
        <div 
          onClick={() => {
            setWindowOpen(true);
            setWindowMinimized(false);
            setIsCrtAnimating(true);
          }}
          className="flex flex-col items-center justify-center w-20 group cursor-pointer"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-[#2bd87a]/20 bg-[#070b13]/60 group-hover:bg-[#2bd87a]/10 group-hover:border-[#2bd87a]/60 shadow-[0_0_5px_rgba(43,216,122,0.1)] group-hover:shadow-[0_0_12px_rgba(43,216,122,0.4)] transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#2bd87a]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
          </div>
          <span className="text-[10px] text-center mt-1 text-[#e2e8f0] truncate w-full px-1 group-hover:text-[#2bd87a] transition-colors">apply_hash.sh</span>
        </div>

        {/* Icon: README.md */}
        <div 
          onClick={() => {
            setWindowOpen(true);
            setWindowMinimized(false);
            setIsCrtAnimating(true);
          }}
          className="flex flex-col items-center justify-center w-20 group cursor-pointer"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-[#57a5e5]/20 bg-[#070b13]/60 group-hover:bg-[#57a5e5]/10 group-hover:border-[#57a5e5]/60 shadow-[0_0_5px_rgba(87,165,229,0.1)] group-hover:shadow-[0_0_12px_rgba(87,165,229,0.4)] transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#57a5e5]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <span className="text-[10px] text-center mt-1 text-[#e2e8f0] truncate w-full px-1 group-hover:text-[#57a5e5] transition-colors">README.md</span>
        </div>

        {/* Icon: Lixeira */}
        <div 
          onClick={() => {
            alert("Lixeira contendo: spaghetti_code.bak, abandoned_saas.tar.gz, empty_dreams.sh");
          }}
          className="flex flex-col items-center justify-center w-20 group cursor-pointer"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-[#ff5f56]/20 bg-[#070b13]/60 group-hover:bg-[#ff5f56]/10 group-hover:border-[#ff5f56]/60 shadow-[0_0_5px_rgba(255,95,86,0.1)] group-hover:shadow-[0_0_12px_rgba(255,95,86,0.4)] transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#ff5f56]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <span className="text-[10px] text-center mt-1 text-[#e2e8f0] truncate w-full px-1 group-hover:text-[#ff5f56] transition-colors">lixeira.bin</span>
        </div>
      </div>

      {/* Area de Trabalho (Workspace) onde a janela fica centralizada */}
      <div className="flex-1 w-full h-[calc(100vh-48px)] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        
        {/* Terminal Container Outer Dragging Wrapper */}
        {windowOpen && !windowMinimized && (
          <div 
            style={windowMaximized ? undefined : { transform: `translate(${position.x}px, ${position.y}px)` }}
            className={windowMaximized 
              ? "fixed inset-0 z-30 flex flex-col w-screen h-screen" 
              : "w-full max-w-4xl z-10 flex flex-col"
            }
          >
            {/* Terminal Container (Inner Window) */}
            <div 
              className={`w-full bg-[#070b13]/85 backdrop-blur-md border border-[#2bd87a]/30 overflow-hidden flex flex-col flex-1 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${
                windowMaximized ? 'rounded-none border-none h-full' : 'rounded-2xl'
              } ${isCrtAnimating ? 'crt-animate-open' : ''}`}
              onAnimationEnd={() => setIsCrtAnimating(false)}
            >
              
              {/* Terminal Header */}
              <div 
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="flex items-center justify-between bg-[#0c101a]/90 backdrop-blur-md px-4 py-3 border-b border-[#6272a4]/20 select-none cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-2">
                  <div 
                    onClick={() => setWindowOpen(false)}
                    className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(255,95,86,0.8)] transition-all"
                    title="Fechar"
                  ></div>
                  <div 
                    onClick={() => setWindowMinimized(true)}
                    className="w-3 h-3 rounded-full bg-[#ffbd2e] cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(255,189,46,0.8)] transition-all"
                    title="Minimizar"
                  ></div>
                  <div 
                    onClick={() => setWindowMaximized(!windowMaximized)}
                    className="w-3 h-3 rounded-full bg-[#57a5e5] cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(87,165,229,0.8)] transition-all"
                    title={windowMaximized ? "Restaurar" : "Maximizar"}
                  ></div>
                </div>
                <div className="text-xs font-semibold text-[#6272a4] flex items-center gap-2">
                  <span>sys_apply: hash_ndi_terminal.sh</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#6272a4]/10 text-[10px] text-[#2bd87a]">v1.0.2-prod</span>
                </div>
                <div className="w-10"></div>
              </div>

              {/* Scrollable Main content area */}
              <div 
                ref={scrollContainerRef} 
                className={`flex flex-1 overflow-y-auto text-sm leading-6 no-scrollbar ${
                  windowMaximized ? 'max-h-none h-full' : 'min-h-[550px] max-h-[800px]'
                }`}
              >
          
          {/* Numbers Line Gutter */}
          <div className="bg-[#0c101a]/50 py-4 px-3 border-r border-[#6272a4]/10 flex flex-col text-right select-none">
            {lineNumbers.map((num) => (
              <div key={num} className="react-gutter-line">{String(num).padStart(2, '0')}</div>
            ))}
          </div>

          {/* Core content body */}
          <div ref={terminalBodyRef} className="flex-1 p-6 flex flex-col space-y-4">
            
            {/* ================= BOOT SEQUENCE ================= */}
            <div className="space-y-4">
              <div>
                <span className="text-[#57a5e5] font-bold">~/network_dos_irmaos$</span>
                <span className="text-[#e2e8f0] ml-2">{bootCommand}</span>
                {showBootCursor && <span className="react-cursor"></span>}
              </div>

              {showBanner && (
                <div className="my-4 overflow-x-auto">
                  <div className="react-glitch-container">
                    <pre className="react-glitch-text text-[10px] sm:text-xs leading-none" data-text={ASCII_ART}>
                      {ASCII_ART}
                    </pre>
                  </div>
                </div>
              )}

              {showManifestoContainer && (
                <div className="space-y-4">
                  <div className="text-[#6272a4] border-l-2 border-[#2bd87a]/40 pl-4 py-1 italic whitespace-pre-wrap">
                    {manifestoTyped}
                  </div>
                  
                  {showTree && (
                    <div ref={treeRef} className="mt-4 text-[#e2e8f0]">
                      <span className="text-[#57a5e5]">├── HASH_NDI/features</span><br />
                      <span className="text-[#6272a4]">│   ├── </span><span className="text-[#2bd87a] font-bold">Engenharia Reversa</span> (Desconstrução de SaaS validados)<br />
                      <span className="text-[#6272a4]">│   ├── </span><span className="text-[#2bd87a] font-bold">Matchmaking</span> (Conectando devs & experts em marketing)<br />
                      <span className="text-[#6272a4]">│   ├── </span><span className="text-[#2bd87a] font-bold">Inteligência Artificial</span> (Automações, APIs, integrações)<br />
                      <span className="text-[#6272a4]">│   └── </span><span className="text-[#2bd87a] font-bold">Repositório de Code</span> (Templates Next.js, boilerplates e infra)<br />
                      <span className="text-[#57a5e5]">└── HASH_NDI/apply_sequence.sh</span>
                    </div>
                  )}

                  {showStartBtn && (
                    <div className="pt-6">
                      <button 
                        onClick={handleStartForm}
                        className="px-6 py-3 border-2 border-[#2bd87a] text-[#2bd87a] font-bold text-sm tracking-wider uppercase bg-transparent hover:bg-[#2bd87a] hover:text-[#03050a] shadow-[0_0_15px_rgba(43,216,122,0.2)] hover:shadow-[0_0_25px_rgba(43,216,122,0.5)] transition-all duration-300 focus:outline-none"
                      >
                        [ INICIAR APLICAÇÃO ]
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================= FORM HISTORY LOGS ================= */}
            {startedForm && (
              <div className="flex flex-col space-y-4">
                <div>
                  <span className="text-[#57a5e5] font-bold">~/network_dos_irmaos$</span>
                  <span className="text-[#e2e8f0] ml-2">{applyCmdTyped}</span>
                  {!applyMsg1Typed && <span className="react-cursor"></span>}
                </div>
                {applyMsg1Typed && (
                  <div>
                    <span className="text-[#6272a4]">{applyMsg1Typed}</span>
                    {!applyMsg2Typed && <span className="react-cursor"></span>}
                  </div>
                )}
                {applyMsg2Typed && (
                  <div>
                    <span className="text-[#6272a4]">{applyMsg2Typed}</span>
                  </div>
                )}

                {history.map((log, idx) => (
                  <div key={idx} className="space-y-1 border-b border-[#6272a4]/5 pb-2">
                    <div className="text-[#6272a4] font-bold">SYSTEM: {log.question}</div>
                    <div className="pl-6">
                      <span className="text-[#57a5e5] font-bold">~/user$</span>{' '}
                      <span className="text-[#2bd87a]">{log.answer}</span>
                    </div>
                  </div>
                ))}

                {/* ================= ACTIVE QUESTION AREA ================= */}
                {!isCompiled && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[#2bd87a] font-bold">SYSTEM:</span>
                      <div className="text-[#e2e8f0]">{activeQuestionText}</div>
                    </div>

                    {/* Active dynamic inputs */}
                    {typedQuestionIndex === currentQuestionIndex && (
                      <div className="pl-6 space-y-3">
                        {questionsList[currentQuestionIndex]?.type === 'text' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#57a5e5]">~/user$</span>
                            <input 
                              type="text" 
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && submitAnswer(questionsList[currentQuestionIndex], inputText.trim())}
                              className="bg-[#0c101a] text-[#2bd87a] border-b border-[#2bd87a]/50 outline-none w-full max-w-md py-1 px-2 font-mono"
                              placeholder="Digite sua resposta e aperte ENTER..."
                              autoFocus
                            />
                            <button 
                              onClick={() => submitAnswer(questionsList[currentQuestionIndex], inputText.trim())}
                              className="px-4 py-1 bg-[#2bd87a] text-[#03050a] font-bold hover:bg-[#1b8a4e] hover:text-white transition-all text-xs"
                            >
                              [ENVIAR]
                            </button>
                          </div>
                        )}

                        {questionsList[currentQuestionIndex]?.type === 'textarea' && (
                          <div className="flex flex-col gap-2 w-full max-w-lg">
                            <span className="text-[#57a5e5]">~/user$ [Use Shift+Enter para quebra de linha]</span>
                            <textarea 
                              value={textareaText}
                              onChange={(e) => setTextareaText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  submitAnswer(questionsList[currentQuestionIndex], textareaText.trim());
                                }
                              }}
                              rows={3} 
                              className="bg-[#0c101a] text-[#2bd87a] border border-[#2bd87a]/30 outline-none w-full p-2 font-mono"
                              placeholder="Digite aqui..."
                              autoFocus
                            ></textarea>
                            <button 
                              onClick={() => submitAnswer(questionsList[currentQuestionIndex], textareaText.trim())}
                              className="px-4 py-1.5 bg-[#2bd87a] text-[#03050a] font-bold hover:bg-[#1b8a4e] hover:text-white self-end transition-all text-xs"
                            >
                              [ENVIAR]
                            </button>
                          </div>
                        )}

                        {questionsList[currentQuestionIndex]?.type === 'radio' && (
                          <div className="space-y-2">
                            {questionsList[currentQuestionIndex].options?.map((opt, idx) => {
                              const letter = String.fromCharCode(65 + idx);
                              return (
                                <AnimatedOption
                                  key={`${currentQuestionIndex}-${opt}`}
                                  text={opt}
                                  prefix={
                                    <span className="px-2 py-0.5 rounded border border-[#2bd87a]/40 group-hover:border-[#2bd87a] bg-[#0c101a] text-xs text-[#2bd87a] font-bold">
                                      [ {letter} ]
                                    </span>
                                  }
                                  onClick={() => submitAnswer(questionsList[currentQuestionIndex], opt)}
                                  className="flex items-center gap-3 py-1 cursor-pointer hover:text-[#2bd87a] group"
                                />
                              );
                            })}
                            <div className="text-[10px] text-[#6272a4] mt-2">* Pressione a tecla correspondente (Ex: A) ou clique na opção.</div>
                          </div>
                        )}

                        {questionsList[currentQuestionIndex]?.type === 'checkbox' && (
                          <div className="space-y-2">
                            {questionsList[currentQuestionIndex].options?.map((opt, idx) => {
                              const letter = String.fromCharCode(65 + idx);
                              const isChecked = checkboxSelections.includes(opt);
                              return (
                                <AnimatedOption
                                  key={`${currentQuestionIndex}-${opt}`}
                                  text={opt}
                                  prefix={
                                    <div className="flex items-center gap-3">
                                      <span className={`px-2 py-0.5 rounded border text-xs font-bold ${isChecked ? 'border-[#2bd87a] text-[#2bd87a]' : 'border-[#6272a4]/40 text-[#6272a4]'}`}>
                                        [ {isChecked ? 'X' : '_'} ]
                                      </span>
                                      <span className="text-xs text-[#2bd87a] font-bold font-mono">{letter}</span>
                                    </div>
                                  }
                                  onClick={() => {
                                    setCheckboxSelections((prev) => 
                                      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
                                    );
                                  }}
                                  className="flex items-center gap-3 py-1 cursor-pointer group"
                                />
                              );
                            })}
                            <div className="flex items-center gap-4 pt-3">
                              <button 
                                onClick={() => submitAnswer(questionsList[currentQuestionIndex], checkboxSelections)}
                                className="px-4 py-1 bg-[#2bd87a] text-[#03050a] font-bold hover:bg-[#1b8a4e] hover:text-white transition-all text-xs"
                              >
                                [CONFIRMAR SELEÇÃO]
                              </button>
                            </div>
                            <div className="text-[10px] text-[#6272a4] mt-1">* Clique para selecionar múltiplas opções. Pressione as letras para alternar e ENTER para avançar.</div>
                          </div>
                        )}

                        {questionsList[currentQuestionIndex]?.type === 'vsl' && (
                          <div className="pl-6 space-y-3">
                            {isVslWindowOpen ? (
                              <>
                                <div className="text-[#ffbd2e] font-semibold flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] animate-pulse"></span>
                                  [JANELA REPRODUTORA VSL ATIVA]
                                </div>
                                <p className="text-xs text-[#6272a4] max-w-lg leading-relaxed font-mono">
                                  O reprodutor de vídeo de apresentação foi iniciado em uma janela separada na sua Área de Trabalho. Assista ao vídeo de introdução para prosseguir.
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="text-[#ff5f56] font-semibold flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] animate-pulse"></span>
                                  [CONEXÃO VSL ENCERRADA]
                                </div>
                                <p className="text-xs text-[#6272a4] max-w-lg leading-relaxed font-mono">
                                  A janela de vídeo foi fechada ou a transmissão foi concluída. Você pode reabrir o vídeo ou continuar com a aplicação.
                                </p>
                                <div className="flex gap-4 pt-1">
                                  <button 
                                    onClick={() => {
                                      setIsVslLoading(true);
                                      setIsVslLocked(true);
                                      setIsVslWindowOpen(true);
                                      setIsVslWindowMinimized(false);
                                    }}
                                    className="px-4 py-1.5 border border-[#ffbd2e] text-[#ffbd2e] hover:bg-[#ffbd2e] hover:text-[#03050a] font-bold uppercase text-xs tracking-wider transition-all duration-300 rounded"
                                  >
                                    Reabrir Janela VSL
                                  </button>
                                  <button 
                                    onClick={handleVslProceed}
                                    className="px-4 py-1.5 border border-[#2bd87a] text-[#2bd87a] hover:bg-[#2bd87a] hover:text-[#03050a] font-bold uppercase text-xs tracking-wider transition-all duration-300 rounded"
                                  >
                                    Ignorar e Avançar
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Loading Bar Animation */}
                    {isProcessingAnswer && (
                      <div className="pl-6 space-y-1 font-mono text-xs">
                        <div className="text-[#57a5e5] animate-pulse">
                          ~/system$ process_answer --sec-handshake
                        </div>
                        <div className="text-[#2bd87a] flex items-center gap-2">
                          <span className="tracking-widest">
                            [{'█'.repeat(Math.floor((processingProgress / 100) * 20))}
                            <span className="text-[#2bd87a]/20">
                              {'░'.repeat(20 - Math.floor((processingProgress / 100) * 20))}
                            </span>]
                          </span>
                          <span>{processingProgress}%</span>
                          {processingProgress === 100 ? (
                            <span className="text-[#2bd87a] font-bold">[OK]</span>
                          ) : (
                            <span className="text-[#6272a4] animate-pulse">[TRANSMITTING]</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Validation Error Message */}
                    {showError && (
                      <div className="pl-6 text-[#ff5f56] font-bold">
                        [ERRO] Campo obrigatório. Por favor preencha antes de avançar.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ================= COMPILATION / FINAL SCREEN ================= */}
            {isCompiled && (
              <div className="space-y-4 pt-4 border-t border-[#6272a4]/20">
                {compiledMsg1 && (
                  <div className="text-[#ffbd2e] font-bold">
                    {compiledMsg1}
                    {!compiledMsg2 && <span className="react-cursor"></span>}
                  </div>
                )}
                {compiledMsg2 && (
                  <div className="text-[#2bd87a] font-bold">
                    {compiledMsg2}
                    {!compiledReport && <span className="react-cursor"></span>}
                  </div>
                )}

                {compiledReport && (
                  <div className="bg-[#0c101a] border border-[#6272a4]/20 p-4 rounded text-xs leading-relaxed max-h-[300px] overflow-y-auto">
                    <pre className="text-[#e2e8f0] whitespace-pre-wrap select-all font-mono">
                      {compiledReport}
                    </pre>
                  </div>
                )}

                {showCompiledActions && (
                  <>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <button 
                        onClick={handleShareWhatsApp}
                        className="px-5 py-2.5 border border-[#2bd87a] bg-transparent text-[#2bd87a] hover:bg-[#2bd87a] hover:text-[#03050a] font-bold uppercase text-xs tracking-wider transition-all duration-300"
                      >
                        Enviar por WhatsApp
                      </button>
                      <button 
                        onClick={handleShareEmail}
                        className="px-5 py-2.5 border border-[#57a5e5] bg-transparent text-[#57a5e5] hover:bg-[#57a5e5] hover:text-[#03050a] font-bold uppercase text-xs tracking-wider transition-all duration-300"
                      >
                        Enviar por E-mail
                      </button>
                      <button 
                        id="react-copy-btn"
                        onClick={handleCopyClipboard}
                        className="px-5 py-2.5 border border-[#ffbd2e] bg-transparent text-[#ffbd2e] hover:bg-[#ffbd2e] hover:text-[#03050a] font-bold uppercase text-xs tracking-wider transition-all duration-300"
                      >
                        Copiar Relatório
                      </button>
                    </div>
                    <div className="text-[10px] text-[#6272a4]">
                      * Seus dados não são armazenados em servidores externos públicos. O envio é feito diretamente pelo seu dispositivo.
                    </div>

                    {/* Dashboard de Pitch de Lead Score */}
                    {(() => {
                      const pitchData = getPersonalizedPitch(leadScore);
                      return (
                        <div className="mt-6 border border-[#2bd87a]/40 bg-[#070b13]/90 rounded-xl p-6 space-y-5 shadow-[0_0_20px_rgba(43,216,122,0.15)]">
                          {/* Profile Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#6272a4]/20 pb-4 gap-3">
                            <div>
                              <div className="text-[10px] text-[#6272a4] font-mono tracking-widest uppercase">Diagnóstico do Algoritmo</div>
                              <h3 className="text-base font-bold font-mono tracking-wide" style={{ color: pitchData.color }}>
                                PERFIL: {pitchData.profile.toUpperCase()}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-[#6272a4]/30 bg-[#6272a4]/10 text-[#6272a4] font-mono">
                                {pitchData.badge}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-[#2bd87a]/30 bg-[#2bd87a]/10 text-[#2bd87a] font-mono">
                                SCORE: {leadScore}/100
                              </span>
                            </div>
                          </div>

                          {/* Pitch Content */}
                          <div className="space-y-3 font-mono">
                            <div>
                              <span className="text-[#2bd87a] font-bold text-xs">Foco recomendado:</span>
                              <div className="text-[#e2e8f0] font-bold text-xs mt-1">{pitchData.focus}</div>
                            </div>
                            <p className="text-xs text-[#e2e8f0] leading-relaxed whitespace-pre-wrap bg-[#0c101a]/50 p-4 border border-[#6272a4]/10 rounded font-mono">
                              {pitchData.text}
                            </p>
                          </div>

                          {/* Offer Details */}
                          <div className="border-t border-[#6272a4]/20 pt-4 space-y-3 font-mono text-center">
                            <div className="font-bold text-[#ffbd2e] text-xs uppercase tracking-wider">
                              🚀 Acesso Combinado Liberado (Sem Limitações)
                            </div>
                            <p className="text-xs text-[#e2e8f0] leading-relaxed max-w-xl mx-auto">
                              Ao ingressar agora, você adquire acesso imediato ao ecossistema completo <strong>HASH_NDI</strong> (boilerplates, tutoriais de SaaS e IA) e à <strong>Comunidade Network dos Irmãos (NDI)</strong> por um valor simbólico exclusivo.
                            </p>
                            <div className="flex flex-col items-center justify-center py-4 bg-[#2bd87a]/5 border border-[#2bd87a]/20 rounded-xl max-w-xs mx-auto">
                              <div className="text-[9px] text-[#6272a4] uppercase tracking-widest font-bold">Comunidade NDI + HASH_NDI</div>
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-[#6272a4] text-xs line-through">R$ 197,00</span>
                                <span className="text-[#2bd87a] text-2xl font-extrabold tracking-tight">R$ 29,90</span>
                              </div>
                              <div className="text-[9px] text-[#2bd87a] font-bold mt-1 uppercase tracking-widest animate-pulse">
                                ★ Acesso Imediato Vitalício ★
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className="flex flex-col items-center justify-center pt-2">
                            <button
                              onClick={() => {
                                setIsCheckoutOpen(true);
                                setIsCheckoutMinimized(false);
                                setCheckoutStatus('idle');
                                setCheckoutPaymentMethod('pix');
                                setPixTimeLeft(600);
                              }}
                              className="w-full max-w-xs py-3 bg-[#2bd87a] hover:bg-[#20bd68] text-[#03050a] font-bold uppercase text-xs tracking-wider rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(43,216,122,0.3)] hover:shadow-[0_0_20px_rgba(43,216,122,0.5)] cursor-pointer text-center flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <span>🔓</span>
                              <span>GARANTIR COMBO POR R$ 29,90</span>
                            </button>
                            <div className="text-[9px] text-[#6272a4] mt-2 font-mono">
                              🔒 Conexão segura SSL 256-bit
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-[#0c101a]/80 px-4 py-2 border-t border-[#6272a4]/20 flex items-center justify-between text-[11px] text-[#6272a4]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2bd87a] animate-ping"></span>
              STATUS: ONLINE
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">BRANCH: main</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ENCODING: UTF-8</span>
            <span>|</span>
            <span>LN {lineNumbers.length}, COL 1</span>
            <span>|</span>
            <span>SHADCN-TERMINAL</span>
          </div>
        </div>

      </div>
    </div>
  )}

  {/* VSL Window Container Outer Dragging Wrapper */}
  {isVslWindowOpen && (
    <div 
      style={{
        display: isVslWindowMinimized ? 'none' : 'flex',
        ...(isVslWindowMaximized ? {} : { left: '50%', top: '50%', transform: `translate(calc(-50% + ${vslPosition.x}px), calc(-50% + ${vslPosition.y}px))` })
      }}
      className={isVslWindowMaximized 
        ? "fixed inset-0 z-30 flex flex-col w-screen h-screen" 
        : "absolute z-20 flex flex-col w-full max-w-xl"
      }
    >
      {/* VSL Window Container (Inner Window) */}
      <div 
        className={`w-full bg-[#070b13]/90 backdrop-blur-md border border-[#ff5f56]/30 overflow-hidden flex flex-col flex-1 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${
          isVslWindowMaximized ? 'rounded-none border-none h-full' : 'rounded-2xl'
        }`}
      >
        {/* VSL Header */}
        <div 
          onMouseDown={handleVslMouseDown}
          onTouchStart={handleVslTouchStart}
          className="flex items-center justify-between bg-[#0c101a]/95 backdrop-blur-md px-4 py-2.5 border-b border-[#6272a4]/20 select-none cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <div 
              onClick={handleCloseVslWindow}
              className={`w-3 h-3 rounded-full bg-[#ff5f56] transition-all ${
                isVslLocked 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(255,95,86,0.8)]'
              }`}
              title={isVslLocked ? "Bloqueado (Aguarde)" : "Fechar"}
            ></div>
            <div 
              onClick={isVslLocked ? undefined : () => setIsVslWindowMinimized(true)}
              className={`w-3 h-3 rounded-full bg-[#ffbd2e] transition-all ${
                isVslLocked 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(255,189,46,0.8)]'
              }`}
              title={isVslLocked ? "Bloqueado (Aguarde)" : "Minimizar"}
            ></div>
            <div 
              onClick={isVslLocked ? undefined : () => setIsVslWindowMaximized(!isVslWindowMaximized)}
              className={`w-3 h-3 rounded-full bg-[#57a5e5] transition-all ${
                isVslLocked 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(87,165,229,0.8)]'
              }`}
              title={isVslLocked ? "Bloqueado (Aguarde)" : (isVslWindowMaximized ? "Restaurar" : "Maximizar")}
            ></div>
          </div>
          <div className="text-[11px] text-[#6272a4] font-semibold tracking-wider flex items-center gap-1.5 font-mono">
            <span>📹</span>
            <span>vsl_presentation.mp4</span>
          </div>
          <div className="w-16"></div>
        </div>

        {/* VSL Content */}
        <div className="relative w-full bg-black overflow-hidden flex flex-col items-center flex-1">
          {/* Blind shield overlay to block direct player clicks */}
          {!isVslProceeded && (
            <div key="vsl-blind-shield" className="absolute inset-0 z-20 cursor-not-allowed bg-transparent" style={{ height: 'calc(100% - 48px)' }}></div>
          )}
          
          {/* YouTube Player Iframe Container */}
          <div key="vsl-player-container" className="w-full aspect-video z-10 bg-black flex items-center justify-center">
            <div ref={playerWrapperRef} className="w-full h-full"></div>
          </div>

          {/* Loading Overlay */}
          {isVslLoading && (
            <div key="vsl-loading-overlay" className="absolute inset-0 bg-[#070b13]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-[#2bd87a]/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#2bd87a] border-r-[#2bd87a] animate-spin"></div>
                </div>
                <div className="text-xs text-[#2bd87a] font-bold tracking-widest uppercase animate-pulse">
                  Estabelecendo canal seguro...
                </div>
                <div className="text-[10px] text-[#6272a4] font-mono">
                  BANDA LARGA DIRETA // PROTOCOLO VSL
                </div>
              </div>
            </div>
          )}
          
          {/* Audio and Proceed Controls bar */}
          <div key="vsl-controls-bar" className="w-full bg-[#0c101a] p-3 border-t border-[#6272a4]/20 flex items-center justify-between z-30">
            {isVslProceeded ? (
              <>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      console.log("[React] Play/Pause clicked!");
                      const player = ytPlayerRef.current;
                      console.log("[React] Player instance:", player);
                      if (!player) {
                        console.error("[React] Player is null or undefined!");
                        return;
                      }
                      try {
                        const state = typeof player.getPlayerState === 'function' ? player.getPlayerState() : null;
                        console.log("[React] Player state:", state);
                        if (state === 1) { // 1 = playing
                          player.pauseVideo();
                          console.log("[React] Called pauseVideo()");
                        } else {
                          player.playVideo();
                          console.log("[React] Called playVideo()");
                        }
                      } catch(e) {
                        console.error("[React] Error in Play/Pause onClick:", e);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#2bd87a] text-[#03050a] font-bold text-xs uppercase hover:bg-[#1b8a4e] hover:text-white transition-all rounded shadow-[0_0_8px_rgba(43,216,122,0.2)] cursor-pointer"
                  >
                    ▶/⏸ Play/Pause
                  </button>
                  <button 
                    onClick={() => {
                      console.log("[React] Seek back clicked!");
                      const player = ytPlayerRef.current;
                      if (!player) {
                        console.error("[React] Player is null or undefined!");
                        return;
                      }
                      try {
                        const curr = player.getCurrentTime();
                        console.log("[React] Current time before seek back:", curr);
                        player.seekTo(Math.max(0, curr - 10), true);
                      } catch(e) {
                        console.error("[React] Error in seek back:", e);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#6272a4] hover:bg-[#4a5578] text-white font-bold text-xs uppercase transition-all rounded cursor-pointer"
                  >
                    ⏪ -10s
                  </button>
                  <button 
                    onClick={() => {
                      console.log("[React] Seek forward clicked!");
                      const player = ytPlayerRef.current;
                      if (!player) {
                        console.error("[React] Player is null or undefined!");
                        return;
                      }
                      try {
                        const curr = player.getCurrentTime();
                        const dur = player.getDuration();
                        console.log("[React] Current time / Duration before seek forward:", curr, "/", dur);
                        player.seekTo(Math.min(dur, curr + 10), true);
                      } catch(e) {
                        console.error("[React] Error in seek forward:", e);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#6272a4] hover:bg-[#4a5578] text-white font-bold text-xs uppercase transition-all rounded cursor-pointer"
                  >
                    ⏩ +10s
                  </button>
                </div>
                <button 
                  onClick={() => {
                    console.log("[React] Toggle Audio clicked!");
                    toggleVslAudio();
                  }}
                  className={`px-3 py-1.5 text-white font-bold text-xs uppercase transition-all duration-200 rounded cursor-pointer ${
                    vslMuted 
                      ? 'bg-[#ff5f56] hover:bg-[#d63f37] shadow-[0_0_8px_rgba(255,95,86,0.2)]' 
                      : 'bg-[#6272a4] hover:bg-[#4a5578]'
                  }`}
                >
                  {vslMuted ? "DESMUTAR" : "SILENCIAR"}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={isVslLocked ? undefined : toggleVslAudio}
                  disabled={isVslLocked}
                  className={`px-4 py-1.5 text-white font-bold text-xs uppercase transition-all duration-200 rounded ${
                    isVslLocked
                      ? 'bg-[#6272a4]/20 text-[#6272a4]/50 cursor-not-allowed border border-[#6272a4]/10'
                      : vslMuted 
                        ? 'bg-[#ff5f56] hover:bg-[#d63f37] shadow-[0_0_8px_rgba(255,95,86,0.2)]' 
                        : 'bg-[#6272a4] hover:bg-[#4a5578]'
                  }`}
                >
                  {vslMuted ? "DESMUTAR VÍDEO" : "SILENCIAR VÍDEO"}
                </button>
                <button 
                  onClick={isVslLocked ? undefined : handleVslProceed}
                  disabled={isVslLocked}
                  className={`px-4 py-1.5 font-bold text-xs uppercase transition-all rounded ${
                    isVslLocked
                      ? 'bg-[#6272a4]/20 text-[#6272a4]/50 cursor-not-allowed border border-[#6272a4]/10'
                      : 'bg-[#2bd87a] text-[#03050a] hover:bg-[#1b8a4e] hover:text-white shadow-[0_0_8px_rgba(43,216,122,0.2)]'
                  }`}
                >
                  AVANÇAR PARA APLICAÇÃO
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Checkout Gateway Window */}
  {isCheckoutOpen && (
    <div 
      style={{
        display: isCheckoutMinimized ? 'none' : 'flex',
        ...(isCheckoutMaximized ? {} : { left: '50%', top: '50%', transform: `translate(calc(-50% + ${checkoutPosition.x}px), calc(-50% + ${checkoutPosition.y}px))` })
      }}
      className={isCheckoutMaximized 
        ? "fixed inset-0 z-40 flex flex-col w-screen h-screen" 
        : "absolute z-30 flex flex-col w-full max-w-md"
      }
    >
      <div 
        className={`w-full bg-[#070b13]/95 backdrop-blur-xl border border-[#2bd87a]/40 overflow-hidden flex flex-col flex-1 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(43,216,122,0.1)] ${
          isCheckoutMaximized ? 'rounded-none border-none h-full' : 'rounded-2xl'
        }`}
      >
        {/* Checkout Header */}
        <div 
          onMouseDown={handleCheckoutMouseDown}
          onTouchStart={handleCheckoutTouchStart}
          className="flex items-center justify-between bg-[#0c101a]/95 backdrop-blur-md px-4 py-2.5 border-b border-[#2bd87a]/20 select-none cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <div 
              onClick={() => { setIsCheckoutOpen(false); clearInterval(pixSimTimerRef.current); }}
              className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(255,95,86,0.8)] transition-all"
              title="Fechar"
            ></div>
            <div 
              onClick={() => setIsCheckoutMinimized(true)}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(255,189,46,0.8)] transition-all"
              title="Minimizar"
            ></div>
            <div 
              onClick={() => setIsCheckoutMaximized(!isCheckoutMaximized)}
              className="w-3 h-3 rounded-full bg-[#57a5e5] cursor-pointer hover:brightness-125 hover:shadow-[0_0_6px_rgba(87,165,229,0.8)] transition-all"
              title={isCheckoutMaximized ? "Restaurar" : "Maximizar"}
            ></div>
          </div>
          <div className="text-[11px] text-[#2bd87a] font-semibold tracking-wider flex items-center gap-1.5 font-mono">
            <span>🔒</span>
            <span>secure_gateway.sh</span>
            <span className="px-1.5 py-0.5 rounded bg-[#2bd87a]/10 text-[9px] text-[#2bd87a] border border-[#2bd87a]/20">SSL</span>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Checkout Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 font-mono text-xs no-scrollbar">
          
          {checkoutStatus === 'success' ? (
            /* Success State */
            <div className="flex flex-col items-center justify-center text-center space-y-5 py-8">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-[#2bd87a]/20 animate-ping"></div>
                <div className="relative w-20 h-20 rounded-full bg-[#2bd87a]/10 border-2 border-[#2bd87a] flex items-center justify-center text-3xl">
                  ✓
                </div>
              </div>
              <div>
                <div className="text-[#2bd87a] font-bold text-sm uppercase tracking-widest">PAGAMENTO CONFIRMADO</div>
                <div className="text-[#6272a4] text-[10px] mt-1">Transação processada com sucesso via Stripe API</div>
              </div>
              <div className="bg-[#0c101a] border border-[#2bd87a]/20 rounded-xl p-4 space-y-2 w-full max-w-xs">
                <div className="text-[#e2e8f0] font-bold">Parabéns{userAnswers[4] ? `, ${userAnswers[4]}` : ''}! 🎉</div>
                <div className="text-[#6272a4] text-[10px] leading-relaxed">
                  Seu acesso à <strong className="text-[#2bd87a]">Comunidade NDI</strong> e à plataforma <strong className="text-[#2bd87a]">HASH_NDI</strong> foi liberado. Verifique seu e-mail para as credenciais de acesso.
                </div>
                <div className="border-t border-[#6272a4]/20 pt-2 mt-2 flex items-baseline justify-between">
                  <span className="text-[#6272a4]">Valor pago:</span>
                  <span className="text-[#2bd87a] font-bold">R$ 29,90</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button 
                  onClick={() => window.open('https://comunidade.ndi.com.br', '_blank')}
                  className="w-full py-2.5 bg-[#2bd87a] text-[#03050a] font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-[#20bd68] transition-all cursor-pointer"
                >
                  Acessar Comunidade NDI
                </button>
                <button 
                  onClick={() => window.open('https://hash.ndi.com.br', '_blank')}
                  className="w-full py-2.5 bg-transparent border border-[#57a5e5] text-[#57a5e5] font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-[#57a5e5] hover:text-[#03050a] transition-all cursor-pointer"
                >
                  Acessar Repositório HASH_NDI
                </button>
              </div>
            </div>
          ) : checkoutStatus === 'processing' ? (
            /* Processing State */
            <div className="flex flex-col items-center justify-center text-center space-y-5 py-12">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#2bd87a]/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[#2bd87a] border-r-[#2bd87a] animate-spin"></div>
              </div>
              <div className="space-y-1">
                <div className="text-[#2bd87a] font-bold uppercase tracking-widest animate-pulse">Processando pagamento...</div>
                <div className="text-[#6272a4] text-[10px]">Conectando ao Stripe Secure Gateway via HTTPS</div>
              </div>
              <div className="text-[10px] text-[#6272a4] font-mono space-y-1 text-left w-full max-w-xs">
                <div className="text-[#57a5e5]">$ curl -X POST https://api.stripe.com/v1/charges</div>
                <div className="text-[#ffbd2e] animate-pulse">⏳ Awaiting response...</div>
              </div>
            </div>
          ) : (
            /* Idle State - Payment Selection */
            <>
              {/* Order Summary */}
              <div className="bg-[#0c101a] border border-[#6272a4]/20 rounded-xl p-4 space-y-2">
                <div className="text-[10px] text-[#6272a4] uppercase tracking-widest font-bold">Resumo do Pedido</div>
                <div className="flex justify-between items-center">
                  <span className="text-[#e2e8f0]">Comunidade NDI + HASH_NDI</span>
                  <span className="text-[#2bd87a] font-bold">R$ 29,90</span>
                </div>
                <div className="border-t border-[#6272a4]/10 pt-2 flex justify-between items-center">
                  <span className="text-[#6272a4]">Total</span>
                  <span className="text-[#2bd87a] font-extrabold text-base">R$ 29,90</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setCheckoutPaymentMethod('pix')}
                  className={`flex-1 py-2 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer border ${
                    checkoutPaymentMethod === 'pix'
                      ? 'bg-[#2bd87a]/15 text-[#2bd87a] border-[#2bd87a]/40 shadow-[0_0_8px_rgba(43,216,122,0.15)]'
                      : 'bg-transparent text-[#6272a4] border-[#6272a4]/20 hover:border-[#6272a4]/40'
                  }`}
                >
                  ⚡ PIX
                </button>
                <button 
                  onClick={() => setCheckoutPaymentMethod('card')}
                  className={`flex-1 py-2 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer border ${
                    checkoutPaymentMethod === 'card'
                      ? 'bg-[#57a5e5]/15 text-[#57a5e5] border-[#57a5e5]/40 shadow-[0_0_8px_rgba(87,165,229,0.15)]'
                      : 'bg-transparent text-[#6272a4] border-[#6272a4]/20 hover:border-[#6272a4]/40'
                  }`}
                >
                  💳 Cartão
                </button>
              </div>

              {/* PIX Tab */}
              {checkoutPaymentMethod === 'pix' && (
                <div className="space-y-4">
                  {/* QR Code Visual */}
                  <div className="flex flex-col items-center py-4">
                    <div className="w-36 h-36 bg-white rounded-xl p-2 shadow-[0_0_20px_rgba(43,216,122,0.2)]">
                      <div className="w-full h-full rounded-lg" style={{
                        background: `
                          repeating-conic-gradient(#111 0% 25%, #fff 0% 50%) 0 0 / 12px 12px,
                          repeating-conic-gradient(#111 0% 25%, #fff 0% 50%) 6px 6px / 12px 12px
                        `,
                        backgroundSize: '12px 12px',
                      }}></div>
                    </div>
                    <div className="text-[9px] text-[#6272a4] mt-2">Escaneie o QR Code com seu aplicativo bancário</div>
                  </div>

                  {/* PIX Code Copy */}
                  <div className="bg-[#0c101a] border border-[#6272a4]/20 rounded-lg p-3 space-y-2">
                    <div className="text-[10px] text-[#6272a4] uppercase tracking-wider font-bold">Código PIX Copia e Cola</div>
                    <div className="bg-[#070b13] border border-[#6272a4]/10 rounded p-2 text-[10px] text-[#e2e8f0] break-all font-mono select-all">
                      00020126580014BR.GOV.BCB.PIX0136hashndi-{Date.now().toString(36).toUpperCase()}520400005303986540529.905802BR5925HASH NDI COMUNIDADE LTDA6009SAO PAULO
                    </div>
                    <button 
                      onClick={() => {
                        const pixCode = `00020126580014BR.GOV.BCB.PIX0136hashndi-${Date.now().toString(36).toUpperCase()}520400005303986540529.905802BR5925HASH NDI COMUNIDADE LTDA6009SAO PAULO`;
                        navigator.clipboard.writeText(pixCode).catch(() => {});
                      }}
                      className="w-full py-2 bg-[#2bd87a]/10 border border-[#2bd87a]/30 text-[#2bd87a] font-bold uppercase text-[10px] tracking-wider rounded-lg hover:bg-[#2bd87a]/20 transition-all cursor-pointer"
                    >
                      📋 Copiar Código PIX
                    </button>
                  </div>

                  {/* PIX Status */}
                  <div className="text-center space-y-1">
                    <div className="text-[10px] text-[#ffbd2e] animate-pulse font-bold">⏳ Aguardando pagamento PIX...</div>
                    <div className="text-[10px] text-[#6272a4]">
                      Expira em: {String(Math.floor(pixTimeLeft / 60)).padStart(2, '0')}:{String(pixTimeLeft % 60).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Confirm PIX Button (simulated) */}
                  <button 
                    onClick={() => {
                      setCheckoutStatus('processing');
                      clearInterval(pixSimTimerRef.current);
                      setTimeout(() => setCheckoutStatus('success'), 2500);
                    }}
                    className="w-full py-2.5 bg-[#2bd87a] text-[#03050a] font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-[#20bd68] transition-all cursor-pointer shadow-[0_0_10px_rgba(43,216,122,0.2)]"
                  >
                    ✓ Já fiz o pagamento PIX
                  </button>
                </div>
              )}

              {/* Card Tab */}
              {checkoutPaymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-[#6272a4] uppercase tracking-wider font-bold block mb-1">Nome no Cartão</label>
                    <input 
                      type="text" 
                      value={ccName}
                      onChange={(e) => setCcName(e.target.value)}
                      placeholder="Nome como está no cartão"
                      className="w-full bg-[#0c101a] border border-[#6272a4]/20 rounded-lg px-3 py-2 text-[#e2e8f0] text-xs focus:outline-none focus:border-[#57a5e5]/60 placeholder:text-[#6272a4]/40"
                    />
                    {ccErrors.name && <div className="text-[10px] text-[#ff5f56] mt-0.5">{ccErrors.name}</div>}
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6272a4] uppercase tracking-wider font-bold block mb-1">Número do Cartão</label>
                    <input 
                      type="text" 
                      value={ccNumber}
                      onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={16}
                      className="w-full bg-[#0c101a] border border-[#6272a4]/20 rounded-lg px-3 py-2 text-[#e2e8f0] text-xs focus:outline-none focus:border-[#57a5e5]/60 placeholder:text-[#6272a4]/40 tracking-widest"
                    />
                    {ccErrors.number && <div className="text-[10px] text-[#ff5f56] mt-0.5">{ccErrors.number}</div>}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] text-[#6272a4] uppercase tracking-wider font-bold block mb-1">Validade</label>
                      <input 
                        type="text" 
                        value={ccExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                          setCcExpiry(val);
                        }}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full bg-[#0c101a] border border-[#6272a4]/20 rounded-lg px-3 py-2 text-[#e2e8f0] text-xs focus:outline-none focus:border-[#57a5e5]/60 placeholder:text-[#6272a4]/40"
                      />
                      {ccErrors.expiry && <div className="text-[10px] text-[#ff5f56] mt-0.5">{ccErrors.expiry}</div>}
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-[#6272a4] uppercase tracking-wider font-bold block mb-1">CVV</label>
                      <input 
                        type="text" 
                        value={ccCvv}
                        onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-[#0c101a] border border-[#6272a4]/20 rounded-lg px-3 py-2 text-[#e2e8f0] text-xs focus:outline-none focus:border-[#57a5e5]/60 placeholder:text-[#6272a4]/40"
                      />
                      {ccErrors.cvv && <div className="text-[10px] text-[#ff5f56] mt-0.5">{ccErrors.cvv}</div>}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const errors: Record<string, string> = {};
                      if (!ccName.trim()) errors.name = 'Nome é obrigatório';
                      if (ccNumber.length < 13) errors.number = 'Número inválido (mín. 13 dígitos)';
                      if (!ccExpiry || ccExpiry.length < 5) errors.expiry = 'Validade inválida';
                      if (ccCvv.length < 3) errors.cvv = 'CVV inválido';
                      setCcErrors(errors);
                      if (Object.keys(errors).length === 0) {
                        setCheckoutStatus('processing');
                        setTimeout(() => setCheckoutStatus('success'), 3000);
                      }
                    }}
                    className="w-full py-2.5 bg-[#57a5e5] text-[#03050a] font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-[#4a90cc] transition-all cursor-pointer shadow-[0_0_10px_rgba(87,165,229,0.2)] mt-2"
                  >
                    💳 Pagar R$ 29,90
                  </button>
                  <div className="text-[9px] text-[#6272a4] text-center">
                    🔒 Transação protegida por criptografia SSL 256-bit
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )}
</div>

{/* Taskbar inferior estilo OS */}
<div className="w-full h-12 bg-[#0c101a]/95 backdrop-blur-md border-t border-[#6272a4]/20 flex items-center justify-between px-4 z-40 select-none">
  {/* Lado Esquerdo: Widget do Sistema */}
  <div className="flex-1 flex justify-start items-center gap-2 text-xs text-[#6272a4] font-semibold">
    <span className="text-[#2bd87a]">🌐</span>
    <span className="hidden md:inline">HASHMAN OS v1.0.3</span>
  </div>

  {/* Lado Central: Menu HASH e Abas de Janelas Ativas (Agrupados e Centralizados) */}
  <div className="flex-initial flex items-center justify-center gap-2 bg-[#0c101a]/60 border border-white/5 rounded-full px-4 py-1 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
    <div className="relative">
      <button 
        onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2bd87a]/10 hover:bg-[#2bd87a]/20 border border-[#2bd87a]/30 hover:border-[#2bd87a]/60 text-[#2bd87a] font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_0_5px_rgba(43,216,122,0.1)] hover:shadow-[0_0_8px_rgba(43,216,122,0.3)]"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#2bd87a] animate-pulse"></span>
        HASH
      </button>

      {/* Pop-up do Menu Iniciar estilo Windows 11 */}
      {isStartMenuOpen && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[480px] max-w-[90vw] bg-[#070b13]/90 backdrop-blur-md border border-[#2bd87a]/30 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-fade-in font-mono text-xs flex flex-col">
          {/* Campo de Busca */}
          <div className="p-4 border-b border-[#6272a4]/10">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Pesquisar aplicativos, arquivos..." 
                className="w-full bg-[#0c101a] border border-[#6272a4]/20 rounded-lg px-8 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#2bd87a]/60 text-xs pl-9" 
                readOnly 
              />
              <span className="absolute left-3 top-2.5 text-[#6272a4]">🔍</span>
            </div>
          </div>

          {/* Seção Fixados (Pinned Apps Grid) */}
          <div className="p-5">
            <div className="text-[10px] text-[#6272a4] font-semibold mb-3 uppercase tracking-wider">Fixados</div>
            <div className="grid grid-cols-3 gap-4">
              {/* Terminal */}
              <div 
                onClick={() => {
                  setWindowOpen(true);
                  setWindowMinimized(false);
                  setIsCrtAnimating(true);
                  setIsStartMenuOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2bd87a]/10 border border-[#2bd87a]/20 text-[#2bd87a] text-lg">
                  &gt;_
                </div>
                <span className="text-[10px] text-center text-[#e2e8f0] font-medium">Terminal</span>
              </div>

              {/* README */}
              <div 
                onClick={() => {
                  setWindowOpen(true);
                  setWindowMinimized(false);
                  setIsCrtAnimating(true);
                  setIsStartMenuOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#57a5e5]/10 border border-[#57a5e5]/20 text-[#57a5e5] text-lg">
                  🖿
                </div>
                <span className="text-[10px] text-center text-[#e2e8f0] font-medium">README.md</span>
              </div>

              {/* NDI Network */}
              <div 
                onClick={() => {
                  window.open('https://wa.me/5511999999999', '_blank');
                  setIsStartMenuOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffbd2e]/10 border border-[#ffbd2e]/20 text-[#ffbd2e] text-lg">
                  🛜
                </div>
                <span className="text-[10px] text-center text-[#e2e8f0] font-medium">NDI Network</span>
              </div>

              {/* SaaS Engine */}
              <div 
                onClick={() => {
                  alert('SaaS Engine: Iniciando ambiente de micro-SaaS...');
                  setIsStartMenuOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#9b51e0]/10 border border-[#9b51e0]/20 text-[#9b51e0] text-lg">
                  ⚙️
                </div>
                <span className="text-[10px] text-center text-[#e2e8f0] font-medium">SaaS Engine</span>
              </div>

              {/* IA Agent */}
              <div 
                onClick={() => {
                  alert('IA Agent: Conectando com agente cognitivo...');
                  setIsStartMenuOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ff5f56]/10 border border-[#ff5f56]/20 text-[#ff5f56] text-lg">
                  🤖
                </div>
                <span className="text-[10px] text-center text-[#e2e8f0] font-medium">Agente IA</span>
              </div>

              {/* Ajustes */}
              <div 
                onClick={() => {
                  alert('Ajustes do HASH OS: Modificadores visuais carregados.');
                  setIsStartMenuOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white text-lg">
                  🛠️
                </div>
                <span className="text-[10px] text-center text-[#e2e8f0] font-medium">Ajustes</span>
              </div>
            </div>
          </div>

          {/* Seção Recomendados */}
          <div className="p-5 border-t border-[#6272a4]/10 bg-[#0c101a]/30 flex-1">
            <div className="text-[10px] text-[#6272a4] font-semibold mb-3 uppercase tracking-wider">Recomendados</div>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => {
                  setWindowOpen(true);
                  setWindowMinimized(false);
                  setIsCrtAnimating(true);
                  setIsStartMenuOpen(false);
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
              >
                <span className="text-[#2bd87a] text-base">&gt;_</span>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#e2e8f0] font-medium">apply_hash.sh</span>
                  <span className="text-[9px] text-[#6272a4]">Recente</span>
                </div>
              </div>

              <div 
                onClick={() => {
                  setWindowOpen(true);
                  setWindowMinimized(false);
                  setIsCrtAnimating(true);
                  setIsStartMenuOpen(false);
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
              >
                <span className="text-[#57a5e5] text-base">🖿</span>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#e2e8f0] font-medium">README.md</span>
                  <span className="text-[9px] text-[#6272a4]">Recente</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé do Menu */}
          <div className="bg-[#0c101a] px-5 py-3.5 border-t border-[#6272a4]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#2bd87a]/20 border border-[#2bd87a]/50 flex items-center justify-center text-[11px] font-bold text-[#2bd87a]">
                H
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#e2e8f0]">hacker@ndi</span>
                <span className="text-[9px] text-[#6272a4]">Admin</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (confirm("Deseja reiniciar a sessão?")) {
                  window.location.reload();
                }
              }} 
              className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer" 
              title="Reiniciar Sistema"
            >
              ⏻
            </button>
          </div>
        </div>
      )}
    </div>

    {windowOpen && (
      <button 
        onClick={() => setWindowMinimized(!windowMinimized)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs border transition-all duration-200 cursor-pointer ${
          !windowMinimized 
            ? 'bg-[#2bd87a]/15 text-[#2bd87a] border-[#2bd87a]/40 shadow-[0_0_5px_rgba(43,216,122,0.15)]' 
            : 'bg-[#6272a4]/5 text-[#6272a4] border-[#6272a4]/20 hover:bg-[#6272a4]/10'
        }`}
      >
        <span>&gt;_</span>
        <span>hash_ndi_terminal.sh</span>
        {!windowMinimized && <span className="w-1.5 h-1.5 rounded-full bg-[#2bd87a]"></span>}
      </button>
    )}

    {isVslWindowOpen && (
      <button 
        onClick={() => setIsVslWindowMinimized(!isVslWindowMinimized)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs border transition-all duration-200 cursor-pointer ${
          !isVslWindowMinimized 
            ? 'bg-[#ff5f56]/15 text-[#ff5f56] border-[#ff5f56]/40 shadow-[0_0_5px_rgba(255,95,86,0.15)]' 
            : 'bg-[#6272a4]/5 text-[#6272a4] border-[#6272a4]/20 hover:bg-[#6272a4]/10'
        }`}
      >
        <span>📹</span>
        <span>vsl_presentation.mp4</span>
        {!isVslWindowMinimized && <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]"></span>}
      </button>
    )}

    {isCheckoutOpen && (
      <button 
        onClick={() => setIsCheckoutMinimized(!isCheckoutMinimized)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs border transition-all duration-200 cursor-pointer ${
          !isCheckoutMinimized 
            ? 'bg-[#2bd87a]/15 text-[#2bd87a] border-[#2bd87a]/40 shadow-[0_0_5px_rgba(43,216,122,0.15)]' 
            : 'bg-[#6272a4]/5 text-[#6272a4] border-[#6272a4]/20 hover:bg-[#6272a4]/10'
        }`}
      >
        <span>🔒</span>
        <span>secure_gateway.sh</span>
        {!isCheckoutMinimized && <span className="w-1.5 h-1.5 rounded-full bg-[#2bd87a]"></span>}
      </button>
    )}
  </div>

  {/* Lado Direito: Status Tray e Relógio */}
  <div className="flex-1 flex justify-end items-center gap-4 text-xs text-[#6272a4] font-semibold pl-2">
    <div className="flex items-center gap-2 text-[10px] hidden sm:flex">
      <span title="Wi-Fi conectado">📶</span>
      <span title="Bateria carregada (100%)">🔋</span>
      <span title="Volume (100%)">🔊</span>
      <span className="border-l border-[#6272a4]/20 h-3 mx-1"></span>
      <span title="Layout de teclado">POR</span>
    </div>
    <div className="tracking-widest">
      {clockTime || "00:00:00"}
    </div>
  </div>
</div>
</main>
  );
}
