
'use client';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreDisplayRef = useRef<HTMLParagraphElement>(null);
  const themeDisplayRef = useRef<HTMLSpanElement>(null);
  const challengeModalRef = useRef<HTMLDivElement>(null);
  const typingChallengeDivRef = useRef<HTMLDivElement>(null);
  const successScreenDivRef = useRef<HTMLDivElement>(null);
  const challengeWordPRef = useRef<HTMLParagraphElement>(null);
  const typingInputRef = useRef<HTMLInputElement>(null);
  const hintContainerRef = useRef<HTMLDivElement>(null);
  const definitionContainerRef = useRef<HTMLDivElement>(null);
  const pointsEarnedSpanRef = useRef<HTMLSpanElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLParagraphElement>(null);
  const hintBtnRef = useRef<HTMLButtonElement>(null);
  const learnBtnRef = useRef<HTMLButtonElement>(null);

  const [_, setHydrated] = useState(false);


  useEffect(() => {
    setHydrated(true);

    let genAI: GoogleGenerativeAI | undefined;
    const MODEL_NAME = 'gemini-2.5-flash-preview-05-20';

    function initializeApi() {
      const apiKey = prompt("Please enter your Google AI API Key:");
      if (!apiKey) {
          alert("API Key is required to use the dynamic features.");
          return false;
      }
      genAI = new GoogleGenerativeAI(apiKey);
      return true;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scoreDisplay = scoreDisplayRef.current;
    const themeDisplay = themeDisplayRef.current;
    const challengeModal = challengeModalRef.current;
    const typingChallengeDiv = typingChallengeDivRef.current;
    const successScreenDiv = successScreenDivRef.current;
    const challengeWordP = challengeWordPRef.current;
    const typingInput = typingInputRef.current;
    const hintContainer = hintContainerRef.current;
    const definitionContainer = definitionContainerRef.current;
    const pointsEarnedSpan = pointsEarnedSpanRef.current;
    const loadingOverlay = loadingOverlayRef.current;
    const loadingText = loadingTextRef.current;
    const hintBtn = hintBtnRef.current;
    const learnBtn = learnBtnRef.current;

    if (!scoreDisplay || !themeDisplay || !challengeModal || !typingChallengeDiv || !successScreenDiv || !challengeWordP || !typingInput || !hintContainer || !definitionContainer || !pointsEarnedSpan || !loadingOverlay || !loadingText || !hintBtn || !learnBtn) return;


    let score = 0;
    let currentTheme = 'Default';
    let words: any[] = [];
    let defaultWords = ["lexicon", "journey", "sprint", "quest", "victory", "challenge", "explore", "discover", "adventure", "swift", "code", "debug", "deploy", "pixels", "sprite", "cloud", "agile", "runtime", "query", "async"];
    
    const world = { width: 4000, height: 800, boundaries: 50 };
    const player = { x: 200, y: world.height - 100, width: 40, height: 60, speed: 5, velY: 0, isJumping: false };
    const camera = { x: 0, y: 0 };
    const keys: {[key:string]: boolean} = {};

    let activeChallenge: any = null;
    let challengeStartTime = 0;
    let animationFrameId: number;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        world.height = canvas.height;
        player.y = world.height - player.height - world.boundaries;
    }

    function drawPlayer() {
        if (!ctx) return;
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawWords() {
        if (!ctx) return;
        ctx.font = "20px 'Press Start 2P'";
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        words.forEach(word => {
            if (!ctx) return;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(word.text, word.x, word.y);
            ctx.restore();
        });
    }
    
    function drawScenery() {
        if (!ctx || !canvas) return;
        const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
        sky.addColorStop(0, '#87CEEB');
        sky.addColorStop(1, '#B0E0E6');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, world.height - world.boundaries, world.width, world.boundaries);
    }

    function drawHills(offsetX: number) {
        if (!ctx) return;
        ctx.fillStyle = '#16a34a';
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(i * 500 - offsetX * 0.5, world.height - world.boundaries, 300, Math.PI, 2 * Math.PI);
            ctx.fill();
        }
    }

    function drawClouds(offsetX: number) {
        if (!ctx) return;
        ctx.fillStyle = 'white';
         for (let i = 0; i < 15; i++) {
            const cloudX = i * 300 - offsetX * 0.8;
            const cloudY = i % 2 === 0 ? 100 : 200;
            ctx.beginPath();
            ctx.arc(cloudX, cloudY, 30, 0, 2 * Math.PI);
            ctx.arc(cloudX + 30, cloudY, 30, 0, 2 * Math.PI);
            ctx.arc(cloudX + 15, cloudY - 15, 30, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function update() {
        if (activeChallenge) return;

        if (keys['d'] || keys['ArrowRight']) player.x += player.speed;
        if (keys['a'] || keys['ArrowLeft']) player.x -= player.speed;
        if ((keys['w'] || keys['ArrowUp'] || keys[' ']) && !player.isJumping) {
            player.velY = -15;
            player.isJumping = true;
        }
        if(keys['s'] || keys['ArrowDown']) {
            // Placeholder for down action if needed
        }

        player.y += player.velY;
        player.velY += 0.8;

        const groundLevel = world.height - player.height - world.boundaries;
        if (player.y > groundLevel) {
            player.y = groundLevel;
            player.velY = 0;
            player.isJumping = false;
        }
        if (player.x < 0) player.x = 0;
        if (player.x > world.width - player.width) player.x = world.width - player.width;


        camera.x = player.x - (canvas?.width ?? 0) / 2;
        if (camera.x < 0) camera.x = 0;
        if (camera.x > world.width - (canvas?.width ?? 0)) camera.x = world.width - (canvas?.width ?? 0);

        for (let i = words.length - 1; i >= 0; i--) {
            const word = words[i];
            const metrics = ctx?.measureText(word.text);
            const wordWidth = metrics?.width ?? 0;
            if (
                player.x < word.x + wordWidth / 2 &&
                player.x + player.width > word.x - wordWidth / 2 &&
                player.y < word.y &&
                player.y + player.height > word.y - 20
            ) {
                triggerChallenge(word, i);
                break;
            }
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function gameLoop() {
        if (!ctx || !canvas) return;
        ctx.save();
        drawScenery();
        ctx.translate(-camera.x, -camera.y);

        drawHills(camera.x);
        drawClouds(camera.x);

        drawPlayer();
        drawWords();

        ctx.restore();
        update();
    }

    function resetGame(newWords: string[], newTheme: string) {
        if(!ctx || !scoreDisplay || !themeDisplay) return;
        score = 0;
        currentTheme = newTheme;
        words = [];
        player.x = 200;
        player.y = world.height - player.height - world.boundaries;
        camera.x = 0;
        scoreDisplay.textContent = score.toString();
        themeDisplay.textContent = currentTheme;
        
        words = newWords.map((text, index) => ({
            text: text,
            x: 600 + index * (Math.random() * 250 + 200),
            y: world.height - world.boundaries - (Math.random() * 200 + 50),
            id: `word-${index}`
        }));
    }

    function triggerChallenge(word: any, index: number) {
        activeChallenge = { ...word, index };
        challengeStartTime = Date.now();
        
        if (!typingChallengeDiv || !successScreenDiv || !hintContainer || !definitionContainer || !learnBtn || !hintBtn || !challengeWordP || !challengeModal || !typingInput) return;

        typingChallengeDiv.classList.remove('hidden');
        successScreenDiv.classList.add('hidden');
        hintContainer.innerHTML = '';
        definitionContainer.innerHTML = '';
        learnBtn.disabled = false;
        hintBtn.disabled = false;
        
        challengeWordP.textContent = word.text;
        challengeModal.classList.remove('hidden');
        typingInput.value = '';
        typingInput.className = 'w-full bg-gray-900 text-white p-4 rounded-lg text-3xl text-center font-mono border-2 border-gray-600 focus:outline-none focus:border-cyan-500';
        typingInput.focus();
    }

    function handleTypingInput(e: Event) {
        const inputElement = e.target as HTMLInputElement;
        const typed = inputElement.value;
        const target = activeChallenge.text;
        
        if (typed === target) {
            inputElement.className = 'w-full bg-gray-900 text-white p-4 rounded-lg text-3xl text-center font-mono border-2 border-green-500 focus:outline-none';
            handleSuccess();
        } else if (target.startsWith(typed)) {
            inputElement.className = 'w-full bg-gray-900 text-white p-4 rounded-lg text-3xl text-center font-mono border-2 border-gray-600 focus:outline-none focus:border-cyan-500';
        } else {
            inputElement.className = 'w-full bg-gray-900 text-white p-4 rounded-lg text-3xl text-center font-mono border-2 border-red-500 focus:outline-none';
        }
    }
    
    function handleSuccess() {
        if(!scoreDisplay || !pointsEarnedSpan || !typingChallengeDiv || !successScreenDiv) return;
        const timeTaken = (Date.now() - challengeStartTime) / 1000;
        const points = Math.max(10, Math.floor(activeChallenge.text.length * 10 - timeTaken * 2));
        score += points;
        scoreDisplay.textContent = score.toString();
        pointsEarnedSpan.textContent = points.toString();

        words.splice(activeChallenge.index, 1);
        
        typingChallengeDiv.classList.add('hidden');
        successScreenDiv.classList.remove('hidden');
    }

    function closeChallenge() {
        if(!challengeModal) return;
        activeChallenge = null;
        challengeModal.classList.add('hidden');
        gameLoop();
    }
    
    async function getNewThemeAndWords() {
        if (!genAI) {
            if (!initializeApi()) return;
        }
        if (!genAI || !loadingOverlay || !loadingText) return;

        loadingOverlay.classList.remove('hidden');
        try {
            loadingText.textContent = "Generating new theme...";
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            const themePrompt = "Generate a single, fun, one-word theme for a typing game. Examples: space, jungle, magic, future, ocean.";
            let result = await model.generateContent(themePrompt);
            let response = await result.response;
            const newTheme = response.text().trim().replace(/["'.]/g, '');

            loadingText.textContent = `Finding words for theme: ${newTheme}...`;
            const wordsModel = genAI.getGenerativeModel({
                model: MODEL_NAME,
                generationConfig: { 
                    responseMimeType: "application/json",
                }
            });
            const wordsPrompt = `Generate a list of 50 English words related to the theme "${newTheme}". Respond with only a JSON array of strings.`;
            result = await wordsModel.generateContent(wordsPrompt);
            response = await result.response;
            const newWords = JSON.parse(response.text());

            resetGame(newWords, newTheme);

        } catch (error) {
            console.error("API Error:", error);
            alert("Failed to generate new theme. Using default words. Check console for details.");
            resetGame(defaultWords, "Default");
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }
    
    async function getHint() {
        if (!activeChallenge || !genAI || !hintBtn || !hintContainer) return;
        hintBtn.disabled = true;
        hintContainer.innerHTML = '<span class="animate-pulse">Getting hint...</span>';
        
        try {
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            const prompt = `Create a short, simple, one-sentence hint for the word "${activeChallenge.text}" within the context of a "${currentTheme}" theme.`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            hintContainer.textContent = response.text();
        } catch (error) {
            console.error("Hint API Error:", error);
            hintContainer.textContent = "Sorry, couldn't get a hint right now.";
        }
    }

    async function getDefinition() {
        if (!activeChallenge || !genAI || !learnBtn || !definitionContainer) return;
        learnBtn.disabled = true;
        definitionContainer.innerHTML = '<span class="animate-pulse">Fetching definition...</span>';
        
        try {
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            const prompt = `Provide a simple, one-sentence definition for the word "${activeChallenge.text}", suitable for a learner.`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            definitionContainer.textContent = response.text();
        } catch (error) {
            console.error("Definition API Error:", error);
            definitionContainer.textContent = "Sorry, couldn't get the definition.";
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    
    const newThemeBtn = document.getElementById('newThemeBtn');
    const continueBtn = document.getElementById('continueBtn');

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    newThemeBtn?.addEventListener('click', getNewThemeAndWords);
    typingInput?.addEventListener('input', handleTypingInput);
    hintBtn?.addEventListener('click', getHint);
    learnBtn?.addEventListener('click', getDefinition);
    continueBtn?.addEventListener('click', closeChallenge);

    resizeCanvas();
    resetGame(defaultWords, "Default");
    gameLoop();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        newThemeBtn?.removeEventListener('click', getNewThemeAndWords);
        typingInput?.removeEventListener('input', handleTypingInput);
        hintBtn?.removeEventListener('click', getHint);
        learnBtn?.removeEventListener('click', getDefinition);
        continueBtn?.removeEventListener('click', closeChallenge);
        cancelAnimationFrame(animationFrameId);
    }
  }, []);

  return (
    <>
      <Head>
        <title>LexiLeap: The Typing Adventure</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>
      <main className="bg-gray-900 text-white overflow-hidden w-screen h-screen">
        <style jsx global>{`
          body { font-family: 'Inter', sans-serif; }
          h1, .font-press-start { font-family: 'Press Start 2P', cursive; }
          .hidden { display: none; }
        `}</style>

        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>

        <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col pointer-events-none">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-press-start text-yellow-300 drop-shadow-lg">LexiLeap</h1>
                    <p className="text-lg text-white">Current Theme: <span ref={themeDisplayRef} id="themeDisplay" className="font-bold text-cyan-300">Default</span></p>
                </div>
                <div className="text-right">
                    <p className="font-press-start text-white">SCORE</p>
                    <p ref={scoreDisplayRef} id="scoreDisplay" className="font-press-start text-3xl text-yellow-300">0</p>
                </div>
            </div>
            <div className="mt-auto ml-auto pointer-events-auto">
                <button id="newThemeBtn" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2">
                    <span className="text-xl">✨</span> New Theme
                </button>
            </div>
        </div>

        <div ref={challengeModalRef} id="challengeModal" className="hidden absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl text-center border-2 border-cyan-400">
                <div ref={typingChallengeDivRef} id="typingChallenge">
                    <h2 className="text-2xl mb-4">Type the word!</h2>
                    <p ref={challengeWordPRef} id="challengeWord" className="font-press-start text-5xl text-yellow-300 mb-6 tracking-widest"></p>
                    <input type="text" ref={typingInputRef} id="typingInput" className="w-full bg-gray-900 text-white p-4 rounded-lg text-3xl text-center font-mono border-2 border-gray-600 focus:outline-none focus:border-cyan-500" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                    <div ref={hintContainerRef} id="hintContainer" className="mt-4 text-cyan-200 min-h-[24px]"></div>
                    <button ref={hintBtnRef} id="hintBtn" className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto">
                        <span className="text-xl">✨</span> Get a Hint
                    </button>
                </div>
                <div ref={successScreenDivRef} id="successScreen" className="hidden">
                     <h2 className="text-3xl text-green-400 font-bold">Correct!</h2>
                     <p className="text-xl mt-2">You earned <span ref={pointsEarnedSpanRef} id="pointsEarned" className="font-bold text-yellow-300"></span> points!</p>
                     <div ref={definitionContainerRef} id="definitionContainer" className="mt-4 text-lg text-left bg-gray-900 p-4 rounded-lg min-h-[60px]"></div>
                     <div className="flex justify-center gap-4 mt-6">
                        <button ref={learnBtnRef} id="learnBtn" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                            <span className="text-xl">✨</span> Learn Word
                        </button>
                        <button id="continueBtn" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Continue</button>
                     </div>
                </div>
            </div>
        </div>

        <div ref={loadingOverlayRef} id="loadingOverlay" className="hidden absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center flex-col gap-4">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p ref={loadingTextRef} id="loadingText" className="text-xl">Generating new theme...</p>
        </div>
      </main>
    </>
  );
}

    