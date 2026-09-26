import{c as e,i as t}from"./html-store-FZsb4AXY.js";function n(){return typeof crypto<`u`&&typeof crypto.randomUUID==`function`?crypto.randomUUID():`id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`}var r=/^\s*(?:[([]?)([A-Da-d1-4])[)\].,:\-]\s+(.*\S)\s*$/,i=/^\s*(?:Q(?:uestion)?\s*)?(\d+)[).:\-]\s+(.*\S)\s*$/i,a=/^\s*(?:Answer|Ans|Correct(?:\s*answer)?)\s*[:\-–]\s*(.+)\s*$/i,o=/^\s*(?:Explanation|Explain|Exp|Solution)\s*[:\-–]\s*(.*)\s*$/i,s=/^\s*Type\s*[:\-]\s*(mcq|msq|numerical)\s*$/i,c=/^\s*(?:Rule|Topic|Subject|Source)\s*[:\-]\s*(.+)\s*$/i,l=[`examData`,`raw_questions_data`,`questions_data`,`questionsData`,`quizData`,`paperData`,`testData`,`mcqData`,`questionBank`,`QUESTION_BANK`,`questions`];function u(e){let t=e.trim();return/^[A-Da-d]$/.test(t)?t.toUpperCase().charCodeAt(0)-65:/^[1-4]$/.test(t)?Number(t)-1:null}function d(e,t,n){let r=e.trim().replace(/^\(|\)$/g,``);if(n===`numerical`)return r;if(n===`msq`){let e=r.split(/[,&+/]|and/i).map(e=>e.trim()).filter(Boolean),t=[];for(let n of e){let e=u(n);if(e===null)return null;t.push(e)}return t}let i=u(r);if(i!==null)return i;let a=r.toLowerCase(),o=t.findIndex(e=>e.toLowerCase()===a);return o>=0?o:null}function f(e,t,r){if(!e)return;let i=e.question.trim();if(!i)return;if(e.type!==`numerical`&&e.options.length<2){r.push(`Skipped (need at least 2 options): “${i.slice(0,60)}”`);return}let a=e.correct??0;e.correct===null&&(r.push(`No answer marked for “${i.slice(0,48)}…” — defaulted to A`),a=0),t.push({id:n(),type:e.type,rule:e.rule||`General`,question:i,options:e.options,correct:a,explanation:e.explanation.trim()})}function p(e){try{return b(JSON.parse(e))}catch{try{let t=e.replace(/,\s*([}\]])/g,`$1`);return b(JSON.parse(t))}catch{return null}}}function m(e){if(e==null)return``;if(typeof e==`string`)return h(e);if(typeof e==`number`||typeof e==`boolean`)return String(e);if(typeof e==`object`){let t=e;return m(t.text??t.label??t.option??t.value??t.en??t.question_en)}return``}function h(e){return e.replace(/<br\s*\/?>/gi,`
`).replace(/<\/p>/gi,`
`).replace(/<[^>]+>/g,` `).replace(/&nbsp;/gi,` `).replace(/&/gi,`&`).replace(/</gi,`<`).replace(/>/gi,`>`).replace(/"/gi,`"`).replace(/\s+\n/g,`
`).replace(/\n\s+/g,`
`).replace(/[ \t]{2,}/g,` `).trim()}function g(e){if(!Array.isArray(e))return{options:[],correctFromFlags:null};let t=[],n=null;return e.forEach((e,r)=>{if(e&&typeof e==`object`){let i=e;t.push(m(i.text??i.label??i.option??i.value??i.en??e)),(i.isCorrect===!0||i.correct===!0||i.answer===!0)&&(n=r)}else t.push(m(e))}),{options:t.filter(Boolean),correctFromFlags:n}}function _(e,t){let n=g(e.options??e.options_en??e.choices).correctFromFlags;if(n!=null)return n;let r=[e.correct,e.answerIndex,e.answer_index,e.correctIndex,e.correct_index,e.answer,e.ans];for(let e of r){if(typeof e==`number`&&Number.isFinite(e))return e;if(Array.isArray(e)){let t=e.map(e=>Number(e)).filter(e=>Number.isFinite(e));if(t.length)return t}if(typeof e==`string`&&e.trim()){let n=d(e,t,`mcq`);return n===null?e.trim():n}}return 0}function v(e){return m(e.question??e.q??e.question_en??e.questionText??e.question_text??e.stem??e.text??e.prompt??e.title)}function y(e){return m(e.explanation??e.solution??e.explain??e.reason??e.solution_en??e.answer_explain)}function b(e){let t=[];if(Array.isArray(e))t.push(...e);else if(e&&typeof e==`object`){let n=e;if(Array.isArray(n.questions)&&t.push(...n.questions),Array.isArray(n.raw_questions_data)&&t.push(...n.raw_questions_data),Array.isArray(n.questions_data)&&t.push(...n.questions_data),Array.isArray(n.items)&&t.push(...n.items),Array.isArray(n.data)&&t.push(...n.data),Array.isArray(n.sections)){for(let e of n.sections)if(Array.isArray(e.questions))for(let n of e.questions)n&&typeof n==`object`?t.push({...n,rule:n.rule||e.name||e.title}):t.push(n)}}if(t.length===0)return null;let r=[],i=[];for(let e of t){if(!e||typeof e!=`object`)continue;let t=e,a=v(t);if(!a)continue;let{options:o}=g(t.options??t.options_en??t.choices??t.answers??t.optionsEn),s=(t.type||`mcq`).toLowerCase(),c=s===`msq`||s===`numerical`?s:`mcq`;r.push({id:n(),type:c,rule:m(t.rule??t.topic??t.subject??t.source??t.section)||`General`,question:a,options:o,correct:_(t,o),explanation:y(t)}),c!==`numerical`&&o.length<2&&i.push(`“${a.slice(0,48)}” has fewer than 2 options`)}return{questions:r,warnings:i,errors:r.length?[]:[`JSON had no questions`]}}function x(e){let t=e.trim();if(!t)return{questions:[],warnings:[],errors:[`Nothing to parse`]};let n=E(t);for(let e of n){let t=p(e);if(t&&t.questions.length)return t}if(t.startsWith(`{`)||t.startsWith(`[`)){let e=p(t);if(e)return e}let l=[],u=[],m=[],h=t.replace(/\r\n/g,`
`).split(`
`),g=null,_=!1,v=e=>({question:e,options:[],correct:null,explanation:``,type:`mcq`,rule:`General`});for(let e of h){if(!e.trim()){_=!1;continue}let t=e.match(s);if(t&&g){g.type=t[1].toLowerCase();continue}let n=e.match(c);if(n&&g){g.rule=n[1].trim();continue}let p=e.match(a);if(p&&g){g.correct=d(p[1],g.options,g.type),g.correct===null&&u.push(`Could not read answer “${p[1].trim()}”`),_=!1;continue}let m=e.match(o);if(m&&g){g.explanation=m[1],_=!0;continue}let h=e.match(r);if(h&&g){g.options.push(h[2].trim()),_=!1;continue}let y=e.match(i);if(y){f(g,l,u),g=v(y[2]),_=!1;continue}if(g&&_){g.explanation+=(g.explanation?` `:``)+e.trim();continue}if(g&&g.options.length===0&&!r.test(e)){g.question+=` `+e.trim();continue}g||=v(e.trim())}return f(g,l,u),l.length===0&&m.push(`Could not detect questions. Use numbered items with A/B/C/D options.`),{questions:l,warnings:u,errors:m}}function S(e){let t=e.match(/<title[^>]*>([^<]+)<\/title>/i);return t?w(t[1]).replace(/TCS\s*iON\s*\|\s*/i,``).replace(/\s+/g,` `).trim():``}function C(e){let t=e.match(/id=["']setting-time["'][^>]*value=["'](\d+)/i)||e.match(/value=["'](\d+)["'][^>]*id=["']setting-time["']/i);if(!t)return;let n=Number(t[1]);return Number.isFinite(n)&&n>0?n:void 0}function w(e){return e.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi,(e,t)=>{let n=t.toLowerCase();return n.startsWith(`#x`)?String.fromCharCode(parseInt(n.slice(2),16)):n.startsWith(`#`)?String.fromCharCode(Number(n.slice(1))):n===`amp`?`&`:n===`lt`?`<`:n===`gt`?`>`:n===`quot`?`"`:n===`apos`||n===`nbsp`?n===`nbsp`?` `:`'`:`&${t};`})}function T(e){let t=O(e,[`examData`]);return!t||t.placeholder||t.value===`{}`?null:t.value}function E(e){let t=[],n=new Set,r=e=>{!e||e===`{}`||e===`[]`||n.has(e)||(n.add(e),t.push(e))};r(T(e));for(let t of l){let n=O(e,[t]);n&&!n.placeholder&&r(n.value)}let i=k(e);return i&&!i.placeholder&&r(i.value),t}function D(e){if(e.includes(`__EXAM_DATA__`))return e;let t=O(e,[`examData`]);return t?e.slice(0,t.start)+`__EXAM_DATA__`+e.slice(t.end):null}function O(e,t){for(let n of t){let t=[RegExp(`(?:const|let|var)\\s+${n}\\s*=\\s*`),RegExp(`window\\.${n}\\s*=\\s*`)];for(let r of t){let t=e.match(r);if(!t||t.index===void 0)continue;let i=t.index+t[0].length;for(;i<e.length&&/\s/.test(e[i]);)i++;if(e.startsWith(`__EXAM_DATA__`,i))return{start:i,end:i+13,value:`__EXAM_DATA__`,placeholder:!0,name:n};if(e[i]!==`{`&&e[i]!==`[`)continue;let a=A(e,i);if(a)return{start:i,end:i+a.length,value:a,placeholder:!1,name:n}}}return null}function k(e){let t=/(?:(?:const|let|var)\s+|window\.)([A-Za-z_][\w]*)\s*=\s*/g,n;for(;n=t.exec(e);){let t=n[1],r=n.index+n[0].length;for(;r<e.length&&/\s/.test(e[r]);)r++;if(e[r]!==`[`&&e[r]!==`{`)continue;let i=A(e,r);if(!(!i||i.length<20)&&(i.startsWith(`[`)||/"question|"options|"question_en|"answerIndex/.test(i.slice(0,400))))return{start:r,end:r+i.length,value:i,placeholder:!1,name:t}}return null}function A(e,t){let n=e[t],r=n===`[`?`]`:n===`{`?`}`:``;if(!r)return null;let i=0,a=!1,o=``,s=!1;for(let c=t;c<e.length;c++){let l=e[c];if(a){if(s){s=!1;continue}if(l===`\\`){s=!0;continue}l===o&&(a=!1);continue}if(l===`"`||l===`'`){a=!0,o=l;continue}if(l===n)i+=1;else if(l===r){if(--i,i===0)return e.slice(t,c+1)}else n===`{`&&l===`{`&&(i+=1)}return null}var j=`<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TCS iON | Rock Mechanics, Supports &amp; Subsidence Practice Test (Overman/Sirdar)</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Roboto+Mono:wght@400;500&amp;display=swap');
        
        :root {
            --tcs-blue: #003366;
            --tcs-light-blue: #0055A4;
        }
        
        body {
            font-family: 'Inter', system_ui, sans-serif;
        }
        
        .tcs-header {
            background: linear-gradient(to right, #003366, #0055A4);
        }
        
        .question-palette {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f8fafc;
        }
        
        .palette-btn {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s ease;
            border: 2px solid #e2e8f0;
        }
        
        .palette-btn.not-visited { background: #fff; color: #64748b; }
        .palette-btn.answered { background: #22c55e; color: white; border-color: #16a34a; }
        .palette-btn.not-answered { background: #f97316; color: white; border-color: #ea580c; }
        .palette-btn.marked { background: #a855f7; color: white; border-color: #9333ea; }
        .palette-btn.answered-marked { 
            background: #22c55e; 
            color: white; 
            border: 3px solid #a855f7; 
            box-shadow: 0 0 0 2px #fff;
        }
        
        .question-container {
            min-height: 420px;
        }
        
        .option-label {
            transition: all 0.2s ease;
        }
        
        .option-label:hover {
            background-color: #f8fafc;
        }
        
        .option-label.selected {
            background-color: #dbeafe;
            border-color: #3b82f6;
        }
        
        .section-tab {
            transition: all 0.3s ease;
        }
        
        .nav-btn {
            transition: all 0.2s ease;
        }
        
        .nav-btn:hover {
            transform: translateY(-1px);
        }
        
        .tcs-shadow {
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        
        .exam-timer {
            font-family: 'Roboto Mono', monospace;
            font-weight: 600;
            letter-spacing: 1px;
        }
        
        .rule-badge {
            font-size: 10px;
            padding: 1px 7px;
            border-radius: 10px;
        }
    </style>
</head>
<body class="bg-slate-100">
    
    <!-- ============================================ -->
    <!-- CANDIDATE INFORMATION FORM (TCS iON Style) -->
    <!-- ============================================ -->
    <div id="candidate-info-screen" class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div class="w-full max-w-lg">
            
            <!-- TCS Header -->
            <div class="flex justify-center mb-6">
                <div class="flex items-center gap-x-3">
                    <div class="w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center shadow-lg">
                        <span class="text-white font-black text-3xl tracking-tighter">TCS</span>
                    </div>
                    <div>
                        <div class="font-bold text-3xl text-[#003366] tracking-tight">iON</div>
                        <div class="text-[10px] text-slate-500 -mt-1 tracking-[3px]">EXAM PLATFORM</div>
                    </div>
                </div>
            </div>

            <!-- Test Info Card -->
            <div class="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                
                <!-- Header -->
                <div class="bg-gradient-to-r from-[#003366] to-[#0055A4] px-8 py-5 text-white">
                    <div class="text-center">
                        <div class="text-xs tracking-[2px] text-blue-200 mb-1">PRACTICE TEST</div>
                        <div class="font-bold text-2xl" id="start-paper-title">Practice Test</div>
                    </div>
                </div>

                <div class="p-8">
                    
                    <!-- Instructions -->
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs text-slate-600">
                        <div class="flex gap-2">
                            <i class="fa-solid fa-info-circle text-[#003366] mt-0.5"></i>
                            <div>
                                This test follows exact <span class="font-semibold">TCS iON</span> exam pattern.<br>
                                <span id="start-counts">Sections • Questions • Section-wise Timer</span><br>
                                <span class="text-[#003366] font-medium"><span id="start-subtitle" class="text-[#003366] font-medium">Generated from your question bank</span>
                            </div>
                        </div>
                    </div>

                    <!-- Candidate details -->
                    <div id="candidate-fields" class="grid gap-3 mb-6">
                        <div>
                            <label for="candidate-name-input" class="text-xs text-slate-500 mb-1 block">Candidate name</label>
                            <input id="candidate-name-input" type="text" placeholder="Your name"
                                   class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]">
                        </div>
                        <div>
                            <label for="candidate-id-input" class="text-xs text-slate-500 mb-1 block">Roll / ID</label>
                            <input id="candidate-id-input" type="text" placeholder="Optional"
                                   class="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#003366]">
                        </div>
                    </div>

                    <!-- Start Button -->
                    <button onclick="startTest()"
                            class="w-full py-4 bg-[#003366] hover:bg-[#002244] active:bg-black transition-all text-white font-bold text-lg rounded-2xl shadow-lg flex items-center justify-center gap-x-3">
                        <span>START TEST</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                    <div class="text-center mt-4">
                        <div class="text-[10px] text-slate-500" id="start-duration">Total Duration will appear here</div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-6 text-xs text-slate-500" id="start-footer">
                SetPaper · template-generated practice paper
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- MAIN EXAM INTERFACE (Hidden initially) -->
    <!-- ============================================ -->
    <div id="exam-interface" style="display: none;">
        
        <!-- Top Header -->
        <div class="tcs-header text-white shadow-lg">
        <div class="max-w-screen-2xl mx-auto">
            <div class="px-6 py-3 flex items-center justify-between">
                <div class="flex items-center gap-x-4">
                    <!-- TCS Logo -->
                    <div class="flex items-center gap-x-2">
                        <div class="w-10 h-10 bg-white rounded flex items-center justify-center">
                            <span class="text-[#003366] font-black text-2xl tracking-tighter">TCS</span>
                        </div>
                        <div>
                            <span class="font-bold text-xl tracking-tight">iON</span>
                            <span class="text-xs font-medium tracking-[2px] block -mt-1">EXAM PLATFORM</span>
                        </div>
                    </div>
                    
                    <div class="h-6 w-px bg-white/30"></div>
                    
                    <div id="candidate-header" class="hidden text-left">
                        <div id="header-candidate-name" class="text-sm font-semibold leading-tight"></div>
                        <div id="header-candidate-id" class="text-[10px] tracking-wide text-blue-100"></div>
                    </div>
                </div>
                
                <div class="flex items-center gap-x-6">
                    <!-- Timer -->
                    <div id="timer-wrap" class="bg-white/10 backdrop-blur px-4 py-1.5 rounded-xl flex items-center gap-x-2 border border-white/20">
                        <i class="fa-solid fa-clock text-lg"></i>
                        <div>
                            <div class="text-[10px] text-blue-200 tracking-wider">TIME LEFT</div>
                            <div id="timer-display" 
                                 class="exam-timer text-2xl font-bold tabular-nums">75:00</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="max-w-screen-2xl mx-auto px-4 pt-4 pb-8">
        
        <!-- Section Tabs -->
        <div class="flex items-center justify-between mb-3 px-1">
            <div class="flex items-center gap-x-1" id="section-tabs">
                <!-- Populated by JS -->
            </div>
            
            <div class="flex items-center gap-x-2 text-sm">
                <div class="px-3 py-1 bg-white rounded-lg shadow-sm flex items-center gap-x-2 text-xs">
                    <div class="flex items-center gap-x-1.5">
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        <span class="font-medium text-slate-600">Answered</span>
                    </div>
                    <div class="flex items-center gap-x-1.5">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="font-medium text-slate-600">Not Answered</span>
                    </div>
                    <div class="flex items-center gap-x-1.5">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="font-medium text-slate-600">Marked</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            <!-- Question Area -->
            <div id="question-column" class="lg:col-span-8 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 overflow-hidden">
                
                <!-- Question Header -->
                <div class="px-6 py-3.5 bg-slate-50 border-b flex items-center justify-between">
                    <div class="flex items-center gap-x-3">
                        <div id="question-number-badge"
                             class="px-4 py-1 bg-[#003366] text-white text-sm font-bold rounded-xl flex items-center gap-x-2">
                            <span id="current-q-no">Q1</span>
                            <span id="current-section-name" class="text-blue-200 text-xs font-normal">Section 1</span>
                        </div>
                        
                        <div id="question-type-badge"
                             class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center">
                            <!-- JS populated -->
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-x-2">
                        <button id="mark-review-btn" onclick="markForReview()"
                                class="px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors">
                            <i class="fa-solid fa-flag"></i>
                            <span>Mark for Review</span>
                        </button>
                        
                        <button id="clear-response-btn" onclick="clearResponse()"
                                class="px-4 py-1.5 text-xs font-semibold flex items-center gap-x-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                            <i class="fa-solid fa-eraser"></i>
                            <span>Clear</span>
                        </button>
                    </div>
                </div>
                
                <!-- Question Content -->
                <div class="p-6 question-container" id="question-area">
                    <!-- Dynamically loaded by JS -->
                </div>
                
                <!-- Navigation Footer -->
                <div class="px-6 py-4 bg-slate-50 border-t flex items-center justify-between">
                    <button onclick="prevQuestion()"
                            class="nav-btn px-6 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40"
                            id="prev-btn">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Previous</span>
                    </button>
                    
                    <div class="flex items-center gap-x-2 text-xs text-slate-500">
                        <span id="progress-text">1 of 25</span>
                    </div>
                    
                    <button onclick="nextQuestion()"
                            class="nav-btn px-7 py-2.5 flex items-center gap-x-2 text-sm font-semibold rounded-2xl bg-[#003366] text-white hover:bg-[#002244]"
                            id="next-btn">
                        <span>Next</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            
            <!-- Question Palette -->
            <div id="palette-column" class="lg:col-span-4 bg-white rounded-2xl shadow tcs-shadow border border-slate-200 flex flex-col">
                <div class="px-5 py-3.5 border-b flex items-center justify-between bg-slate-50 rounded-t-2xl">
                    <div>
                        <span class="font-bold text-slate-700">Question Palette</span>
                    </div>
                    <div class="text-xs px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded font-mono" id="palette-progress">
                        0/115
                    </div>
                </div>
                
                <div class="p-4 flex-1 overflow-auto question-palette" style="max-height: 460px;">
                    <div id="palette-grid" class="grid grid-cols-5 gap-2.5">
                        <!-- Populated dynamically by JS -->
                    </div>
                </div>
                
                <div class="p-4 border-t bg-slate-50 rounded-b-2xl">
                    <button id="submit-section-btn" onclick="submitCurrentSection()"
                            class="w-full py-3 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl flex items-center justify-center gap-x-2 shadow-sm">
                        <i class="fa-solid fa-check-double"></i>
                        <span>SUBMIT SECTION</span>
                    </button>
                </div>
            </div>
            
        </div>
        
        <!-- Instructions Bar -->
        <div class="mt-4 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs flex items-center gap-x-4 text-slate-600">
            <div class="flex items-center gap-x-1.5">
                <i class="fa-solid fa-info-circle text-blue-500"></i>
                <span class="font-medium">Instructions:</span>
            </div>
            <div class="flex-1 text-[11px]">
                • Use <strong>Mark for Review</strong> for questions you want to revisit later &nbsp;•&nbsp; 
                Timer is section-wise &nbsp;•&nbsp; 
                You can navigate freely between questions
            </div>
        </div>
        
    </div>
    
    <!-- Final Summary Modal -->
    <div id="summary-modal" class="hidden fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-2xl mx-4 rounded-3xl overflow-hidden shadow-2xl">
            <div class="px-8 py-6 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-bold">Test Summary</h3>
                    </div>
                    <i onclick="closeSummary()" class="fa-solid fa-times text-2xl cursor-pointer hover:text-blue-200"></i>
                </div>
            </div>
            
            <div class="p-8">
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <!-- Row 1 -->
                    <div onclick="showCategoryReview('attempted')" class="bg-green-50 border border-green-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all">
                        <div class="text-green-600 text-xs font-semibold tracking-wider flex items-center gap-x-1">
                            <i class="fa-solid fa-check-double text-xs"></i> ATTEMPTED
                        </div>
                        <div id="summary-attempted" class="text-4xl font-black text-green-700 mt-1">0</div>
                        <div class="text-[10px] text-green-600 mt-0.5">Click to review</div>
                    </div>
                    <div onclick="showCategoryReview('correct')" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all">
                        <div class="text-emerald-600 text-xs font-semibold tracking-wider flex items-center gap-x-1">
                            <i class="fa-solid fa-check text-xs"></i> CORRECT
                        </div>
                        <div id="summary-correct" class="text-4xl font-black text-emerald-700 mt-1">0</div>
                        <div class="text-[10px] text-emerald-600 mt-0.5">Click to review</div>
                    </div>
                    <div onclick="showCategoryReview('wrong')" class="bg-red-50 border border-red-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all">
                        <div class="text-red-600 text-xs font-semibold tracking-wider flex items-center gap-x-1">
                            <i class="fa-solid fa-times text-xs"></i> WRONG
                        </div>
                        <div id="summary-wrong" class="text-4xl font-black text-red-600 mt-1">0</div>
                        <div class="text-[10px] text-red-600 mt-0.5">Click to review</div>
                    </div>
                    
                    <!-- Row 2 -->
                    <div onclick="showCategoryReview('not-attempted')" class="bg-orange-50 border border-orange-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all">
                        <div class="text-orange-600 text-xs font-semibold tracking-wider flex items-center gap-x-1">
                            <i class="fa-solid fa-question text-xs"></i> NOT ATTEMPTED
                        </div>
                        <div id="summary-not-attempted" class="text-4xl font-black text-orange-600 mt-1">0</div>
                        <div class="text-[10px] text-orange-600 mt-0.5">Click to review</div>
                    </div>
                    <div onclick="showCategoryReview('marked')" class="bg-purple-50 border border-purple-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all">
                        <div class="text-purple-600 text-xs font-semibold tracking-wider flex items-center gap-x-1">
                            <i class="fa-solid fa-flag text-xs"></i> MARKED FOR REVIEW
                        </div>
                        <div id="summary-marked" class="text-4xl font-black text-purple-700 mt-1">0</div>
                        <div class="text-[10px] text-purple-600 mt-0.5">Click to review</div>
                    </div>
                    <div onclick="showCategoryReview('all')" class="bg-slate-50 border border-slate-200 rounded-2xl p-4 cursor-pointer hover:shadow-md active:scale-[0.985] transition-all">
                        <div class="text-slate-600 text-xs font-semibold tracking-wider flex items-center gap-x-1">
                            <i class="fa-solid fa-list text-xs"></i> TOTAL QUESTIONS
                        </div>
                        <div id="summary-total-questions" class="text-4xl font-black text-slate-700 mt-1">115</div>
                        <div class="text-[10px] text-slate-600 mt-0.5">Click to review</div>
                    </div>
                </div>
                
                <div class="bg-[#003366] text-white rounded-2xl p-4 mb-6 text-center">
                    <div class="text-xs tracking-[1px] text-blue-200">YOUR SCORE</div>
                    <div class="flex items-baseline justify-center gap-x-2">
                        <span id="summary-score" class="text-5xl font-black">0</span>
                        <span class="text-2xl text-blue-200">/ <span id="summary-max-score">115</span></span>
                    </div>
                    <div id="summary-percentage" class="text-sm text-blue-200 mt-0.5">0% Accuracy</div>
                </div>
                
                <div class="text-center">
                    <button onclick="restartTest()"
                            class="px-8 py-3 text-sm font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl mr-3">
                        <i class="fa-solid fa-redo mr-2"></i> RESTART TEST
                    </button>
                    <button onclick="finishAndShowAnswers()"
                            class="px-8 py-3 text-sm font-bold bg-[#003366] hover:bg-[#002244] text-white rounded-2xl">
                        VIEW DETAILED ANSWERS &amp; EXPLANATIONS
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // ==================== DATA: Questions (total auto-detected in summary) ====================
                const examData = __EXAM_DATA__;
        const examSettings = Object.assign({
            timerMode: "section",
            extraMinutes: 0,
            optionOrder: "as-written",
            allowSectionSwitch: true,
            showMarkForReview: true,
            showClear: true,
            showPalette: true,
            showSubmitSection: true,
            showTimer: true
        }, (examData && examData.settings) || {});
        // ==================== STATE MANAGEMENT ====================
        function notifyHost(type, payload) {
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ source: "setpaper-exam", type: type, payload: payload }, "*");
                }
            } catch (err) {}
        }
        let currentSection = 0;
        let currentQuestion = 0;
        let userAnswers = {}; // {sectionIndex: {qIndex: answer}}
        let markedForReview = {}; // {sectionIndex: {qIndex: true}}
        let visited = {}; // {sectionIndex: {qIndex: true}}
        let sectionTimers = {};
        let timerInterval = null;
        let testSubmitted = false;
        let overallSeconds = 0;
        
        // Initialize state
        function initState() {
            examData.sections.forEach((section, sIdx) => {
                userAnswers[sIdx] = {};
                markedForReview[sIdx] = {};
                visited[sIdx] = {};
                sectionTimers[sIdx] = section.timeMinutes * 60;
            });
            overallSeconds = examData.sections.reduce((n, s) => n + (s.timeMinutes || 0) * 60, 0);
        }

        function applyPaperChrome() {
            const markBtn = document.getElementById("mark-review-btn");
            const clearBtn = document.getElementById("clear-response-btn");
            const palette = document.getElementById("palette-column");
            const questionCol = document.getElementById("question-column");
            const submitBtn = document.getElementById("submit-section-btn");
            const timerWrap = document.getElementById("timer-wrap");
            if (markBtn) markBtn.style.display = examSettings.showMarkForReview ? "" : "none";
            if (clearBtn) clearBtn.style.display = examSettings.showClear ? "" : "none";
            if (submitBtn) submitBtn.style.display = examSettings.showSubmitSection ? "" : "none";
            if (palette) palette.style.display = examSettings.showPalette ? "" : "none";
            if (questionCol) {
                questionCol.classList.remove("lg:col-span-8", "lg:col-span-12");
                questionCol.classList.add(examSettings.showPalette ? "lg:col-span-8" : "lg:col-span-12");
            }
            if (timerWrap) timerWrap.style.display = examSettings.showTimer && examSettings.timerMode !== "off" ? "" : "none";
        }
        
        // ==================== TIMER ====================
        function startSectionTimer() {
            clearInterval(timerInterval);
            const timerWrap = document.getElementById("timer-wrap");
            if (!examSettings.showTimer || examSettings.timerMode === "off") {
                if (timerWrap) timerWrap.style.display = "none";
                return;
            }
            if (timerWrap) timerWrap.style.display = "";

            if (examSettings.timerMode === "overall") {
                updateTimerDisplay(overallSeconds);
                timerInterval = setInterval(() => {
                    overallSeconds--;
                    updateTimerDisplay(overallSeconds);
                    if (overallSeconds <= 0) {
                        clearInterval(timerInterval);
                        alert("Time is over. Submitting the paper.");
                        showFinalSummary();
                    }
                }, 1000);
                return;
            }
            
            const timeLeft = sectionTimers[currentSection];
            updateTimerDisplay(timeLeft);
            
            timerInterval = setInterval(() => {
                sectionTimers[currentSection]--;
                updateTimerDisplay(sectionTimers[currentSection]);
                
                if (sectionTimers[currentSection] <= 0) {
                    clearInterval(timerInterval);
                    alert("Section time is over! Submitting current section automatically.");
                    submitCurrentSection(true);
                }
            }, 1000);
        }
        
        function updateTimerDisplay(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            const display = \`\${min.toString().padStart(2, '0')}:\${sec.toString().padStart(2, '0')}\`;
            document.getElementById('timer-display').innerHTML = display;
            
            // Warning color
            const timerEl = document.getElementById('timer-display');
            if (seconds < 120) {
                timerEl.classList.add('text-red-400');
            } else {
                timerEl.classList.remove('text-red-400');
            }
        }
        
        // ==================== RENDER SECTION TABS ====================
        function renderSectionTabs() {
            const container = document.getElementById('section-tabs');
            container.innerHTML = '';
            
            examData.sections.forEach((section, idx) => {
                const btn = document.createElement('button');
                btn.className = \`section-tab px-5 py-2 text-sm font-semibold rounded-2xl flex items-center gap-x-2 transition-all \${idx === currentSection ? 
                    'bg-[#003366] text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}\`;
                
                btn.innerHTML = \`
                    <span>\${section.name}</span>
                    <span class="text-xs px-1.5 py-0.5 rounded \${idx === currentSection ? 'bg-white/20' : 'bg-slate-100'}">\${section.questions.length}Q</span>
                \`;
                
                btn.onclick = () => {
                    if (!examSettings.allowSectionSwitch) return;
                    if (idx !== currentSection) {
                        // Auto save current
                        saveCurrentAnswer();
                        currentSection = idx;
                        currentQuestion = 0;
                        renderCurrentQuestion();
                        renderPalette();
                        renderSectionTabs();
                        if (examSettings.timerMode === "section") startSectionTimer();
                    }
                };
                
                container.appendChild(btn);
            });
        }
        
        // ==================== RENDER QUESTION ====================
        function renderCurrentQuestion() {
            const section = examData.sections[currentSection];
            const q = section.questions[currentQuestion];
            const qArea = document.getElementById('question-area');
            
            // Mark as visited
            if (!visited[currentSection]) visited[currentSection] = {};
            visited[currentSection][currentQuestion] = true;
            
            let html = \`
                <div class="mb-2 flex items-center gap-x-2">
                    <span class="rule-badge bg-slate-100 text-slate-600 font-mono">\${q.rule}</span>
                </div>
                <div class="text-lg font-semibold text-slate-800 leading-snug mb-5">\${q.question}</div>
            \`;
            
            if (q.type === "mcq") {
                html += \`<div class="space-y-2.5">\`;
                q.options.forEach((opt, idx) => {
                    const isSelected = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] === idx;
                    html += \`
                        <label onclick="selectMCQ(\${idx})" 
                               class="option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer \${isSelected ? 'selected border-blue-500' : 'border-slate-200'}">
                            <div class="mt-0.5">
                                <input type="radio" name="q\${q.id}" \${isSelected ? 'checked' : ''} class="accent-[#003366]">
                            </div>
                            <div class="flex-1 text-[15px] text-slate-700">\${opt}</div>
                        </label>
                    \`;
                });
                html += \`</div>\`;
            } 
            else if (q.type === "msq") {
                html += \`<div class="text-xs text-orange-600 mb-2 font-medium">⚡ Multiple answers can be correct</div>\`;
                html += \`<div class="space-y-2.5">\`;
                q.options.forEach((opt, idx) => {
                    const selectedAnswers = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : [];
                    const isSelected = selectedAnswers.includes(idx);
                    html += \`
                        <label onclick="toggleMSQ(\${idx})" 
                               class="option-label flex items-start gap-x-3 p-4 border rounded-2xl cursor-pointer \${isSelected ? 'selected border-blue-500' : 'border-slate-200'}">
                            <div class="mt-0.5">
                                <input type="checkbox" \${isSelected ? 'checked' : ''} class="accent-[#003366]">
                            </div>
                            <div class="flex-1 text-[15px] text-slate-700">\${opt}</div>
                        </label>
                    \`;
                });
                html += \`</div>\`;
            } 
            else if (q.type === "numerical") {
                const currentVal = userAnswers[currentSection] && userAnswers[currentSection][currentQuestion] ? userAnswers[currentSection][currentQuestion] : '';
                html += \`
                    <div class="mt-2">
                        <div class="text-xs text-slate-500 mb-1.5">Enter the number:</div>
                        <input type="text" id="numerical-input" value="\${currentVal}" 
                               oninput="saveNumericalAnswer()"
                               class="w-full px-5 py-4 text-xl font-semibold border-2 border-slate-300 focus:border-[#003366] rounded-2xl outline-none">
                    </div>
                \`;
            }
            
            qArea.innerHTML = html;
            
            // Update badges
            document.getElementById('current-q-no').innerText = \`Q\${q.id}\`;
            document.getElementById('current-section-name').innerText = section.name;
            
            const typeBadge = document.getElementById('question-type-badge');
            if (q.type === "mcq") {
                typeBadge.innerHTML = \`<i class="fa-solid fa-check-circle mr-1"></i> Single Correct\`;
                typeBadge.className = \`px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center\`;
            } else if (q.type === "msq") {
                typeBadge.innerHTML = \`<i class="fa-solid fa-tasks mr-1"></i> Multiple Select\`;
                typeBadge.className = \`px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 flex items-center\`;
            } else if (q.type === "numerical") {
                typeBadge.innerHTML = \`<i class="fa-solid fa-calculator mr-1"></i> Numerical\`;
                typeBadge.className = \`px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center\`;
            }
            
            // Progress
            document.getElementById('progress-text').innerText = \`\${currentQuestion + 1} of \${section.questions.length}\`;
            
            // Enable/disable nav buttons
            document.getElementById('prev-btn').disabled = currentQuestion === 0;
            document.getElementById('next-btn').innerHTML = currentQuestion === section.questions.length - 1 ? 
                \`Finish Section <i class="fa-solid fa-check ml-2"></i>\` : \`Next <i class="fa-solid fa-arrow-right ml-2"></i>\`;
            
            updatePalette();
        }
        
        // ==================== ANSWER HANDLING ====================
        function selectMCQ(optionIndex) {
            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};
            userAnswers[currentSection][currentQuestion] = optionIndex;
            renderCurrentQuestion();
            updatePalette();
        }
        
        function toggleMSQ(optionIndex) {
            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};
            if (!userAnswers[currentSection][currentQuestion]) userAnswers[currentSection][currentQuestion] = [];
            
            let answers = userAnswers[currentSection][currentQuestion];
            const idx = answers.indexOf(optionIndex);
            
            if (idx > -1) {
                answers.splice(idx, 1);
            } else {
                answers.push(optionIndex);
            }
            
            renderCurrentQuestion();
            updatePalette();
        }
        
        function saveNumericalAnswer() {
            const input = document.getElementById('numerical-input');
            if (!input) return;
            
            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};
            userAnswers[currentSection][currentQuestion] = input.value.trim();
            updatePalette();
        }
        
        function saveCurrentAnswer() {
            // For numerical, already saved on input
            // MCQ/MSQ already saved on click
        }
        
        function clearResponse() {
            if (!userAnswers[currentSection]) userAnswers[currentSection] = {};
            delete userAnswers[currentSection][currentQuestion];
            
            if (markedForReview[currentSection]) {
                delete markedForReview[currentSection][currentQuestion];
            }
            
            renderCurrentQuestion();
            updatePalette();
        }
        
        function markForReview() {
            if (!markedForReview[currentSection]) markedForReview[currentSection] = {};
            markedForReview[currentSection][currentQuestion] = true;
            updatePalette();
            
            // Visual feedback
            const btns = document.querySelectorAll('.option-label');
            btns.forEach(b => b.style.transition = 'all 0.1s');
        }
        
        // ==================== PALETTE ====================
        function updatePalette() {
            const container = document.getElementById('palette-grid');
            container.innerHTML = '';
            
            const section = examData.sections[currentSection];
            const totalQ = section.questions.length;
            
            let answeredCount = 0;
            
            for (let i = 0; i < totalQ; i++) {
                const btn = document.createElement('button');
                btn.className = \`palette-btn rounded-xl text-sm font-bold\`;
                
                let status = 'not-visited';
                let label = i + 1;
                
                const isAnswered = userAnswers[currentSection] && userAnswers[currentSection][i] !== undefined && 
                                   (Array.isArray(userAnswers[currentSection][i]) ? userAnswers[currentSection][i].length > 0 : true);
                
                const isMarked = markedForReview[currentSection] && markedForReview[currentSection][i];
                const isVisited = visited[currentSection] && visited[currentSection][i];
                
                if (isAnswered && isMarked) {
                    status = 'answered-marked';
                } else if (isAnswered) {
                    status = 'answered';
                    answeredCount++;
                } else if (isMarked) {
                    status = 'marked';
                } else if (isVisited) {
                    status = 'not-answered';
                }
                
                btn.classList.add(status);
                btn.innerText = label;
                
                if (i === currentQuestion) {
                    btn.style.boxShadow = '0 0 0 3px #003366';
                    btn.style.transform = 'scale(1.05)';
                }
                
                btn.onclick = () => {
                    saveCurrentAnswer();
                    currentQuestion = i;
                    renderCurrentQuestion();
                    updatePalette();
                };
                
                container.appendChild(btn);
            }
            
            // Update progress text
            document.getElementById('palette-progress').innerText = \`\${answeredCount}/\${totalQ}\`;
        }
        
        function renderPalette() {
            updatePalette();
        }
        
        // ==================== NAVIGATION ====================
        function nextQuestion() {
            saveCurrentAnswer();
            if (typeof saveNumericalAnswer === "function") saveNumericalAnswer();
            
            const section = examData.sections[currentSection];
            if (!section) {
                showFinalSummary();
                return;
            }
            
            if (currentQuestion < section.questions.length - 1) {
                currentQuestion++;
                renderCurrentQuestion();
                updatePalette();
            } else {
                submitCurrentSection(true);
            }
        }
        
        function prevQuestion() {
            saveCurrentAnswer();
            if (currentQuestion > 0) {
                currentQuestion--;
                renderCurrentQuestion();
                updatePalette();
            }
        }
        
        // ==================== SUBMIT SECTION ====================
        function answersMatch(q, userAns) {
            if (!q || userAns === undefined || userAns === null || userAns === "") return false;
            if (q.type === "mcq") return userAns === q.correct;
            if (q.type === "msq") {
                const a = (Array.isArray(userAns) ? userAns : []).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });
                const b = (Array.isArray(q.correct) ? q.correct : [q.correct]).map(Number).filter(Number.isFinite).sort(function (x, y) { return x - y; });
                return JSON.stringify(a) === JSON.stringify(b);
            }
            if (q.type === "numerical") return String(userAns).trim() === String(q.correct).trim();
            return false;
        }

        function submitPaper() {
            if (typeof saveNumericalAnswer === "function") saveNumericalAnswer();
            showFinalSummary();
        }

        function submitCurrentSection(auto = false) {
            clearInterval(timerInterval);
            if (typeof saveNumericalAnswer === "function") saveNumericalAnswer();
            
            const section = examData.sections[currentSection];
            if (!section) {
                showFinalSummary();
                return;
            }
            
            if (currentSection >= examData.sections.length - 1) {
                showFinalSummary();
                return;
            }
            
            currentSection++;
            currentQuestion = 0;
            renderSectionTabs();
            renderCurrentQuestion();
            renderPalette();
            startSectionTimer();
            const btn = document.getElementById("submit-section-btn");
            if (btn) {
                const label = btn.querySelector("span");
                if (label) label.textContent = currentSection >= examData.sections.length - 1 ? "SUBMIT PAPER" : "SUBMIT SECTION";
            }
        }
        
        // ==================== FINAL SUMMARY ====================
        function showFinalSummary() {
            testSubmitted = true;
            clearInterval(timerInterval);
            
            let totalAnswered = 0;
            let totalMarked = 0;
            let totalQuestions = 0;
            let correctCount = 0;
            let wrongCount = 0;
            
            examData.sections.forEach((section, sIdx) => {
                totalQuestions += section.questions.length;
                section.questions.forEach((q, qIdx) => {
                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;
                    
                    if (userAns !== undefined) {
                        const ans = userAns;
                        if (Array.isArray(ans) ? ans.length > 0 : true) {
                            totalAnswered++;
                            
                            let isCorrect = answersMatch(q, userAns);
                            if (isCorrect) {
                                correctCount++;
                            } else {
                                wrongCount++;
                            }
                        }
                    }
                    
                    if (markedForReview[sIdx] && markedForReview[sIdx][qIdx]) totalMarked++;
                });
            });
            
            const notAttempted = totalQuestions - totalAnswered;
            const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
            
            try {
            document.getElementById('summary-attempted').innerText = totalAnswered;
            document.getElementById('summary-not-attempted').innerText = notAttempted;
            document.getElementById('summary-marked').innerText = totalMarked;
            document.getElementById('summary-correct').innerText = correctCount;
            document.getElementById('summary-wrong').innerText = wrongCount;
            document.getElementById('summary-score').innerText = correctCount;
            document.getElementById('summary-percentage').innerText = \`\${percentage}% Accuracy\`;
            document.getElementById('summary-total-questions').innerText = totalQuestions;
            document.getElementById('summary-max-score').innerText = totalQuestions;
            } catch (err) {}
            
            
            const itemResults = [];
            examData.sections.forEach((section, sIdx) => {
                section.questions.forEach((q, qIdx) => {
                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;
                    let isAttempted = false;
                    let isCorrect = false;
                    if (userAns !== undefined) {
                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {
                            isAttempted = userAns !== "";
                            isCorrect = answersMatch(q, userAns);
                        }
                    }
                    const isMarked = !!(markedForReview[sIdx] && markedForReview[sIdx][qIdx]);
                    itemResults.push({
                        bankId: q.bankId || q.id,
                        id: q.id,
                        type: q.type,
                        userAns: userAns === undefined ? null : userAns,
                        isAttempted: isAttempted,
                        isCorrect: isCorrect,
                        isMarked: isMarked,
                        sectionIdx: sIdx,
                        qIdx: qIdx
                    });
                });
            });
            notifyHost("exam-complete", {
                attempted: totalAnswered,
                correct: correctCount,
                wrong: wrongCount,
                notAttempted: notAttempted,
                marked: totalMarked,
                score: correctCount,
                total: totalQuestions,
                items: itemResults
            });

            try {
                document.getElementById('summary-modal').classList.remove('hidden');
                document.getElementById('summary-modal').classList.add('flex');
            } catch (err) {}
        }
        
        function closeSummary() {
            document.getElementById('summary-modal').classList.remove('flex');
            document.getElementById('summary-modal').classList.add('hidden');
        }
        
        function finishAndShowAnswers() {
            closeSummary();
            showDetailedAnswers();
        }
        
        function showDetailedAnswers() {
            const container = document.createElement('div');
            container.className = \`fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4\`;
            
            let html = \`
                <div class="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col">
                    <div class="px-8 py-5 bg-[#003366] text-white flex justify-between items-center">
                        <div>
                            <span class="font-bold text-xl">Detailed Answers &amp; Explanations</span>
                            <span class="ml-3 text-xs bg-white/20 px-3 py-1 rounded">For Self-Assessment</span>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="text-white text-2xl hover:text-red-300">×</button>
                    </div>
                    
                    <div class="overflow-auto p-6 flex-1 bg-slate-50" style="max-height: calc(92vh - 140px)">
            \`;
            
            let qNo = 1;
            examData.sections.forEach((section, sIdx) => {
                html += \`<div class="mb-8"><div class="font-bold text-lg mb-3 text-[#003366] sticky top-0 bg-slate-50 py-1">\${section.name} — \${section.title}</div>\`;
                
                section.questions.forEach((q, qIdx) => {
                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;
                    let isCorrect = false;
                    
                    if (q.type === "mcq" && userAns !== undefined) {
                        isCorrect = userAns === q.correct;
                    } else if (q.type === "msq" && Array.isArray(userAns)) {
                        isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());
                    } else if (q.type === "numerical" && userAns !== undefined) {
                        isCorrect = userAns.toString().trim() === q.correct.toString();
                    }
                    
                    const statusColor = isCorrect ? 'green' : (userAns !== undefined ? 'red' : 'slate');
                    
                    html += \`
                        <div class="mb-5 bg-white border border-slate-200 rounded-2xl p-5">
                            <div class="flex gap-x-3">
                                <div class="font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500">\${q.rule}</div>
                                <div class="flex-1">
                                    <div class="font-semibold text-slate-800">\${qNo}. \${q.question}</div>
                                    
                                    <div class="mt-3 text-sm">
                    \`;
                    
                    if (q.type === "mcq") {
                        q.options.forEach((opt, idx) => {
                            let cls = '';
                            if (idx === q.correct) cls = 'text-green-700 font-semibold';
                            if (userAns === idx && idx !== q.correct) cls = 'text-red-600 line-through';
                            
                            html += \`<div class="flex items-center gap-x-2 py-0.5 \${cls}">
                                <span class="font-mono text-xs w-5">\${String.fromCharCode(65+idx)}.</span> 
                                <span>\${opt}</span>
                                \${idx === q.correct ? '<i class="fa-solid fa-check text-green-500 ml-1"></i>' : ''}
                            </div>\`;
                        });
                    } else if (q.type === "msq") {
                        q.options.forEach((opt, idx) => {
                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);
                            const isCorrectOpt = q.correct.includes(idx);
                            
                            let cls = '';
                            if (isCorrectOpt) cls = 'text-green-700 font-semibold';
                            if (userSelected && !isCorrectOpt) cls = 'text-red-600 line-through';
                            
                            html += \`<div class="flex items-center gap-x-2 py-0.5 \${cls}">
                                <span class="font-mono text-xs w-5">\${String.fromCharCode(65+idx)}.</span> 
                                <span>\${opt}</span>
                                \${isCorrectOpt ? '<i class="fa-solid fa-check text-green-500 ml-1"></i>' : ''}
                            </div>\`;
                        });
                    } else if (q.type === "numerical") {
                        html += \`<div class="mt-1">
                            <span class="text-xs text-slate-500">Your Answer:</span> 
                            <span class="font-semibold \${isCorrect ? 'text-green-600' : 'text-red-600'}">\${userAns || 'Not Answered'}</span><br>
                            <span class="text-xs text-slate-500">Correct Answer:</span> 
                            <span class="font-semibold text-green-700">\${q.correct}</span>
                        </div>\`;
                    }
                    
                    html += \`</div>
                            <div class="mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600">\${q.explanation}</div>
                        </div></div></div>\`;
                    
                    qNo++;
                });
                
                html += \`</div>\`;
            });
            
            html += \`</div></div>\`;
            container.innerHTML = html;
            document.body.appendChild(container);
        }
        
        // ==================== CATEGORY REVIEW (Clickable Summary Cards) ====================
        function showCategoryReview(category) {
            closeSummary();
            
            let filteredQuestions = [];
            let categoryTitle = '';
            let categoryIcon = '';
            let categoryColor = 'slate';
            
            examData.sections.forEach((section, sIdx) => {
                section.questions.forEach((q, qIdx) => {
                    const userAns = userAnswers[sIdx] ? userAnswers[sIdx][qIdx] : undefined;
                    const isMarked = markedForReview[sIdx] && markedForReview[sIdx][qIdx];
                    
                    let isCorrect = false;
                    let isAttempted = false;
                    
                    if (userAns !== undefined) {
                        if (Array.isArray(userAns) ? userAns.length > 0 : true) {
                            isAttempted = true;
                            
                            if (q.type === "mcq") {
                                isCorrect = userAns === q.correct;
                            } else if (q.type === "msq" && Array.isArray(userAns)) {
                                isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correct.sort());
                            } else if (q.type === "numerical") {
                                isCorrect = userAns.toString().trim() === q.correct.toString();
                            }
                        }
                    }
                    
                    let include = false;
                    
                    if (category === 'all') include = true;
                    else if (category === 'correct' && isAttempted && isCorrect) include = true;
                    else if (category === 'wrong' && isAttempted && !isCorrect) include = true;
                    else if (category === 'attempted' && isAttempted) include = true;
                    else if (category === 'not-attempted' && !isAttempted) include = true;
                    else if (category === 'marked' && isMarked) include = true;
                    
                    if (include) {
                        filteredQuestions.push({
                            sectionIdx: sIdx,
                            qIdx: qIdx,
                            sectionName: section.name,
                            sectionTitle: section.title,
                            question: q,
                            userAns: userAns,
                            isCorrect: isCorrect,
                            isMarked: isMarked
                        });
                    }
                });
            });
            
            // Set title based on category
            if (category === 'all') {
                categoryTitle = \`All Questions (\${filteredQuestions.length})\`;
                categoryIcon = 'fa-list-ul';
                categoryColor = 'slate';
            } else if (category === 'correct') {
                categoryTitle = \`Correct Answers (\${filteredQuestions.length})\`;
                categoryIcon = 'fa-check-circle';
                categoryColor = 'emerald';
            } else if (category === 'wrong') {
                categoryTitle = \`Wrong Answers (\${filteredQuestions.length})\`;
                categoryIcon = 'fa-times-circle';
                categoryColor = 'red';
            } else if (category === 'attempted') {
                categoryTitle = \`Attempted Questions (\${filteredQuestions.length})\`;
                categoryIcon = 'fa-check-double';
                categoryColor = 'green';
            } else if (category === 'not-attempted') {
                categoryTitle = \`Not Attempted (\${filteredQuestions.length})\`;
                categoryIcon = 'fa-question-circle';
                categoryColor = 'orange';
            } else if (category === 'marked') {
                categoryTitle = \`Marked for Review (\${filteredQuestions.length})\`;
                categoryIcon = 'fa-flag';
                categoryColor = 'purple';
            }
            
            const container = document.createElement('div');
            container.className = \`fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4\`;
            
            let html = \`
                <div class="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col">
                    <div class="px-8 py-5 bg-[#003366] text-white flex justify-between items-center">
                        <div class="flex items-center gap-x-3">
                            <i class="fa-solid \${categoryIcon} text-2xl text-\${categoryColor}-400"></i>
                            <div>
                                <span class="font-bold text-xl">\${categoryTitle}</span>
                                <span class="ml-3 text-xs bg-white/20 px-3 py-1 rounded">Review Mode</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-x-2">
                            <button onclick="this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');" 
                                    class="px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-x-2">
                                <i class="fa-solid fa-arrow-left"></i> 
                                <span>Back to Summary</span>
                            </button>
                            <button onclick="this.closest('.fixed').remove()" class="text-white text-3xl leading-none hover:text-red-300 px-2">×</button>
                        </div>
                    </div>
                    
                    <div class="overflow-auto p-6 flex-1 bg-slate-50" style="max-height: calc(92vh - 140px)">
            \`;
            
            if (filteredQuestions.length === 0) {
                html += \`
                    <div class="flex flex-col items-center justify-center py-16 text-center">
                        <i class="fa-solid \${categoryIcon} text-6xl text-slate-300 mb-4"></i>
                        <div class="text-xl font-semibold text-slate-600">No questions in this category</div>
                        <div class="text-sm text-slate-500 mt-1">Great job! Keep practicing.</div>
                    </div>
                \`;
            } else {
                filteredQuestions.forEach((item, index) => {
                    const q = item.question;
                    const userAns = item.userAns;
                    const isCorrect = item.isCorrect;
                    const qNoGlobal = (item.sectionIdx * 10) + (item.qIdx + 1); // Approximate global number
                    
                    html += \`
                        <div class="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <div class="flex items-start gap-x-3">
                                <div class="font-mono text-xs px-2.5 h-fit py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0 mt-0.5">\${q.rule}</div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-x-2 mb-1">
                                        <span class="font-bold text-slate-700">Q\${qNoGlobal}</span>
                                        <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">\${item.sectionName}</span>
                                        \${item.isMarked ? '<span class="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"><i class="fa-solid fa-flag mr-1"></i>Marked</span>' : ''}
                                    </div>
                                    
                                    <div class="font-semibold text-slate-800 mb-3">\${q.question}</div>
                    \`;
                    
                    // Options rendering (same logic as detailed answers)
                    if (q.type === "mcq") {
                        html += \`<div class="space-y-1 text-sm">\`;
                        q.options.forEach((opt, idx) => {
                            let cls = 'text-slate-700';
                            let icon = '';
                            
                            if (idx === q.correct) {
                                cls = 'text-green-700 font-semibold';
                                icon = '<i class="fa-solid fa-check text-green-500 ml-1.5"></i>';
                            }
                            if (userAns === idx && idx !== q.correct) {
                                cls = 'text-red-600 line-through';
                            }
                            
                            html += \`
                                <div class="flex items-center gap-x-2 py-1 px-2 rounded \${cls}">
                                    <span class="font-mono text-xs w-5 flex-shrink-0">\${String.fromCharCode(65+idx)}.</span> 
                                    <span class="flex-1">\${opt}</span>
                                    \${icon}
                                </div>
                            \`;
                        });
                        html += \`</div>\`;
                    } else if (q.type === "msq") {
                        html += \`<div class="space-y-1 text-sm">\`;
                        q.options.forEach((opt, idx) => {
                            const userSelected = Array.isArray(userAns) && userAns.includes(idx);
                            const isCorrectOpt = q.correct.includes(idx);
                            
                            let cls = 'text-slate-700';
                            let icon = '';
                            
                            if (isCorrectOpt) {
                                cls = 'text-green-700 font-semibold';
                                icon = '<i class="fa-solid fa-check text-green-500 ml-1.5"></i>';
                            }
                            if (userSelected && !isCorrectOpt) {
                                cls = 'text-red-600 line-through';
                            }
                            
                            html += \`
                                <div class="flex items-center gap-x-2 py-1 px-2 rounded \${cls}">
                                    <span class="font-mono text-xs w-5 flex-shrink-0">\${String.fromCharCode(65+idx)}.</span> 
                                    <span class="flex-1">\${opt}</span>
                                    \${icon}
                                </div>
                            \`;
                        });
                        html += \`</div>\`;
                    } else if (q.type === "numerical") {
                        html += \`
                            <div class="mt-2 p-3 bg-slate-50 rounded-xl text-sm">
                                <div><span class="text-xs text-slate-500">Your Answer:</span> <span class="font-semibold \${isCorrect ? 'text-green-600' : 'text-red-600'}">\${userAns || 'Not Answered'}</span></div>
                                <div class="mt-1"><span class="text-xs text-slate-500">Correct Answer:</span> <span class="font-semibold text-green-700">\${q.correct}</span></div>
                            </div>
                        \`;
                    }
                    
                    html += \`
                                    <div class="mt-4 text-xs bg-slate-50 border-l-4 border-[#003366] pl-3 py-2 text-slate-600">
                                        \${q.explanation}
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;
                });
            }
            
            html += \`
                    </div>
                    
                    <div class="px-8 py-4 border-t bg-white flex justify-between items-center">
                        <div class="text-xs text-slate-500">
                            Click on any card in Summary to filter questions
                        </div>
                        <button onclick="this.closest('.fixed').remove(); document.getElementById('summary-modal').classList.remove('hidden'); document.getElementById('summary-modal').classList.add('flex');"
                                class="px-5 py-2 text-sm font-semibold bg-[#003366] text-white rounded-2xl flex items-center gap-x-2 hover:bg-[#002244]">
                            <i class="fa-solid fa-arrow-left"></i>
                            <span>Back to Summary</span>
                        </button>
                    </div>
                </div>
            \`;
            
            container.innerHTML = html;
            document.body.appendChild(container);
        }
        
        function restartTest() {
            if (confirm("क्या आप पूरा टेस्ट restart करना चाहते हैं? सारी progress मिट जाएगी।")) {
                location.reload();
            }
        }

        // ==================== CANDIDATE INFO HANDLER ====================
        function startTest() {
            const nameInput = (document.getElementById("candidate-name-input") || {}).value || (examData.meta && examData.meta.candidateName) || "";
            const idInput = (document.getElementById("candidate-id-input") || {}).value || (examData.meta && examData.meta.candidateId) || "";
            const selectedLang = "Hinglish";

            window.candidateName = nameInput;
            window.candidateId = idInput;
            window.selectedLanguage = selectedLang;

            const header = document.getElementById("candidate-header");
            const headerName = document.getElementById("header-candidate-name");
            const headerId = document.getElementById("header-candidate-id");
            if (headerName) headerName.textContent = nameInput || "Candidate";
            if (headerId) headerId.textContent = idInput || "";
            if (header) header.classList.toggle("hidden", !nameInput && !idInput);

            document.getElementById('candidate-info-screen').style.display = 'none';
            document.getElementById('exam-interface').style.display = 'block';

            initializeExam();
            notifyHost('exam-started', { sections: examData.sections.length, questions: examData.sections.reduce((n,s)=>n+s.questions.length,0) });

            // Show simple start toast (no language badge since removed)
            setTimeout(() => {
                const startToast = document.createElement('div');
                startToast.className = \`fixed bottom-5 left-5 bg-white shadow-xl border px-4 py-2.5 rounded-2xl text-sm flex items-center gap-x-2 z-50\`;
                startToast.innerHTML = \`
                    <div class="text-[#003366]"><i class="fa-solid fa-play"></i></div>
                    <div class="text-xs">Test started successfully. Good luck!</div>
                \`;
                document.body.appendChild(startToast);
                setTimeout(() => startToast.remove(), 2200);
            }, 800);
        }
        
        // ==================== INITIALIZE ====================
        function initializeExam() {
            initState();
            applyPaperChrome();
            renderSectionTabs();
            renderCurrentQuestion();
            renderPalette();
            startSectionTimer();
            
            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (testSubmitted) return;
                
                if (e.key === "ArrowRight") {
                    nextQuestion();
                } else if (e.key === "ArrowLeft") {
                    prevQuestion();
                } else if (e.key.toLowerCase() === "m") {
                    if (examSettings.showMarkForReview) markForReview();
                } else if (e.key.toLowerCase() === "c") {
                    if (examSettings.showClear) clearResponse();
                }
            });
            
            // Welcome toast
            setTimeout(() => {
                const toast = document.createElement('div');
                toast.className = \`fixed bottom-5 right-5 bg-white shadow-xl border px-5 py-3 rounded-2xl text-sm flex items-center gap-x-3 z-40\`;
                toast.innerHTML = \`
                    <div class="text-emerald-600"><i class="fa-solid fa-info-circle"></i></div>
                    <div class="text-xs">Tip: Press <span class="font-mono bg-slate-100 px-1.5 rounded">M</span> to Mark for Review &nbsp;•&nbsp; <span class="font-mono bg-slate-100 px-1.5 rounded">C</span> to Clear</div>
                \`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 4200);
            }, 6500);
            
            console.log("%c[SetPaper] Paper ready.", "color:#64748b");
        }

        function fillStartScreen() {
            const totalQ = examData.sections.reduce(function (n, s) { return n + s.questions.length; }, 0);
            const secs = examData.sections.length;
            const mins = examData.sections.reduce(function (n, s) { return n + (s.timeMinutes || s.questions.length); }, 0);
            const meta = examData.meta || {};
            const titleEl = document.getElementById("start-paper-title");
            const countsEl = document.getElementById("start-counts");
            const subEl = document.getElementById("start-subtitle");
            const durEl = document.getElementById("start-duration");
            const footEl = document.getElementById("start-footer");
            const nameEl = document.getElementById("candidate-name-input");
            const idEl = document.getElementById("candidate-id-input");
            if (titleEl) titleEl.textContent = meta.title || "Practice Test";
            const timerLabel = examSettings.timerMode === "off"
                ? "No timer"
                : examSettings.timerMode === "overall"
                    ? "One paper timer"
                    : "Section-wise timer";
            if (countsEl) countsEl.textContent = secs + " Sections • " + totalQ + " Questions • " + timerLabel;
            if (subEl) subEl.textContent = meta.subtitle || "Generated from your question bank";
            if (durEl) durEl.textContent = examSettings.timerMode === "off"
                ? secs + " Sections · untimed"
                : "Total Duration: ~" + mins + " Minutes | " + secs + " Sections";
            if (footEl) footEl.textContent = meta.footer || "SetPaper · template-generated practice paper";
            if (nameEl && meta.candidateName) nameEl.value = meta.candidateName;
            if (idEl && meta.candidateId) idEl.value = meta.candidateId;
            const sumTotal = document.getElementById("summary-total-questions");
            const sumMax = document.getElementById("summary-max-score");
            if (sumTotal) sumTotal.textContent = String(totalQ);
            if (sumMax) sumMax.textContent = String(totalQ);
        }
        fillStartScreen();
        
        // Boot - We call initializeExam manually after candidate form
        // window.onload = initializeExam;   // Disabled - now called from startTest()
    <\/script>
    
    </div> <!-- End of #exam-interface -->
</body>
</html>`;function M(e){return e.replace(/\bconst\s+examData\s*=/,`var examData = window.examData =`).replace(/\blet\s+userAnswers\s*=/,`var userAnswers = window.userAnswers =`).replace(/\blet\s+markedForReview\s*=/,`var markedForReview = window.markedForReview =`).replace(/\blet\s+visited\s*=/,`var visited = window.visited =`).replace(/\blet\s+currentSection\s*=/,`var currentSection =`).replace(/\blet\s+currentQuestion\s*=/,`var currentQuestion =`)}var N=`<script>
(function () {
  if (window.__setpaperHost) return;
  window.__setpaperHost = true;

  function notifyHost(type, payload) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ source: "setpaper-exam", type: type, payload: payload }, "*");
      }
    } catch (err) {}
  }
  window.notifyHost = notifyHost;

  function asList(value) {
    if (Array.isArray(value)) return value.slice().map(Number).filter(function (n) { return Number.isFinite(n); }).sort(function (a, b) { return a - b; });
    if (typeof value === "number" && Number.isFinite(value)) return [value];
    return [];
  }

  function isCorrect(q, userAns) {
    if (!q || userAns === undefined || userAns === null || userAns === "") return false;
    if (q.type === "mcq") return userAns === q.correct;
    if (q.type === "msq") return JSON.stringify(asList(userAns)) === JSON.stringify(asList(q.correct));
    if (q.type === "numerical") return String(userAns).trim() === String(q.correct).trim();
    return false;
  }

  function collectFromEmt() {
    var qs = (window.questions_data && window.questions_data.length) ? window.questions_data : window.raw_questions_data;
    var ans = window.answers;
    if (!Array.isArray(qs) || !qs.length) return null;
    var data = window.examData;
    var bankByText = {};
    if (data && data.sections) {
      data.sections.forEach(function (section) {
        (section.questions || []).forEach(function (q) {
          var key = String(q.question || "").replace(/\\s+/g, " ").trim();
          if (key) bankByText[key] = q.bankId || q.id;
        });
      });
    }
    var items = [];
    var correct = 0, wrong = 0, attempted = 0, marked = 0, total = 0;
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i] || {};
      total += 1;
      var userAns = Array.isArray(ans) ? ans[i] : null;
      var isAttempted = userAns !== undefined && userAns !== null && userAns !== "";
      var ok = isAttempted && userAns === q.answerIndex;
      if (isAttempted) {
        attempted += 1;
        if (ok) correct += 1;
        else wrong += 1;
      }
      var isMarked = !!(window.marked && window.marked[i]);
      if (isMarked) marked += 1;
      var text = String(q.question_en || q.question || "").replace(/\\s+/g, " ").trim();
      items.push({
        bankId: q.bankId || bankByText[text] || q.id,
        id: q.id,
        type: "mcq",
        userAns: isAttempted ? userAns : null,
        isAttempted: isAttempted,
        isCorrect: !!ok,
        isMarked: isMarked,
        sectionIdx: 0,
        qIdx: i
      });
    }
    return {
      attempted: attempted,
      correct: correct,
      wrong: wrong,
      notAttempted: Math.max(0, total - attempted),
      marked: marked,
      score: correct,
      total: total,
      items: items
    };
  }

  function collectResults() {
    var emt = collectFromEmt();
    if (emt && emt.total) return emt;
    var data = window.examData || { sections: [] };
    var answers = window.userAnswers || {};
    var marks = window.markedForReview || {};
    var items = [];
    var correct = 0, wrong = 0, attempted = 0, marked = 0, total = 0;
    (data.sections || []).forEach(function (section, sIdx) {
      (section.questions || []).forEach(function (q, qIdx) {
        total += 1;
        var userAns = answers[sIdx] ? answers[sIdx][qIdx] : undefined;
        var isAttempted = false;
        var ok = false;
        if (userAns !== undefined && userAns !== null && !(Array.isArray(userAns) && userAns.length === 0) && userAns !== "") {
          isAttempted = true;
          attempted += 1;
          ok = isCorrect(q, userAns);
          if (ok) correct += 1;
          else wrong += 1;
        }
        var isMarked = !!(marks[sIdx] && marks[sIdx][qIdx]);
        if (isMarked) marked += 1;
        items.push({
          bankId: q.bankId || q.id,
          id: q.id,
          type: q.type,
          userAns: userAns === undefined ? null : userAns,
          isAttempted: isAttempted,
          isCorrect: ok,
          isMarked: isMarked,
          sectionIdx: sIdx,
          qIdx: qIdx
        });
      });
    });
    return {
      attempted: attempted,
      correct: correct,
      wrong: wrong,
      notAttempted: Math.max(0, total - attempted),
      marked: marked,
      score: correct,
      total: total,
      items: items
    };
  }
  window.collectExamResults = collectResults;

  function saveOpenAnswer() {
    try {
      if (typeof saveNumericalAnswer === "function") saveNumericalAnswer();
      if (typeof saveCurrentAnswer === "function") saveCurrentAnswer();
    } catch (err) {}
  }

  function submitPaper() {
    saveOpenAnswer();
    if (locked()) {
      showLockNote();
      return;
    }
    if (typeof showFinalSummary === "function") showFinalSummary();
    else notifyHost("exam-complete", collectResults());
  }
  window.submitPaper = submitPaper;

  window.confirm = function () { return true; };

  function locked() {
    var until = Number(window.__setpaperLockUntil || 0);
    return until > 0 && Date.now() < until;
  }

  function showLockNote() {
    var el = document.getElementById("setpaper-lock-note");
    if (!el) {
      el = document.createElement("div");
      el.id = "setpaper-lock-note";
      el.style.cssText = "position:sticky;top:0;z-index:50;margin:8px 0;padding:10px 12px;border-radius:12px;background:#003366;color:#fff;font:600 13px/1.4 Inter,system-ui,sans-serif;text-align:center;";
      var exam = document.getElementById("exam-interface") || document.body;
      exam.insertBefore(el, exam.firstChild);
    }
    var until = Number(window.__setpaperLockUntil || 0);
    var left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    var m = Math.floor(left / 60);
    var s = left % 60;
    el.textContent = "Time still running · " + m + ":" + (s < 10 ? "0" : "") + s + " — the paper submits when time ends.";
    el.style.display = locked() ? "block" : "none";
  }

  var origShow = window.showFinalSummary;
  window.showFinalSummary = function () {
    saveOpenAnswer();
    if (locked()) {
      showLockNote();
      return;
    }
    try {
      if (typeof origShow === "function") origShow.apply(this, arguments);
    } catch (err) {}
    notifyHost("exam-complete", collectResults());
  };

  var origSubmit = window.submitCurrentSection;
  window.submitCurrentSection = function (auto) {
    saveOpenAnswer();
    var data = window.examData || { sections: [] };
    var sections = data.sections || [];
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    if (!sections[idx] || idx >= sections.length - 1) {
      submitPaper();
      return;
    }
    try {
      if (typeof origSubmit === "function") origSubmit.call(this, auto === undefined ? true : auto);
    } catch (err) {
      submitPaper();
    }
  };

  var origNext = window.nextQuestion;
  window.nextQuestion = function () {
    saveOpenAnswer();
    var data = window.examData || { sections: [] };
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    var qIdx = typeof window.currentQuestion === "number" ? window.currentQuestion : 0;
    var section = (data.sections || [])[idx];
    if (section && qIdx >= (section.questions || []).length - 1) {
      window.submitCurrentSection(true);
      return;
    }
    if (typeof origNext === "function") origNext.apply(this, arguments);
  };

  function labelSubmit() {
    var data = window.examData || { sections: [] };
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    var last = idx >= (data.sections || []).length - 1;
    var btn = document.getElementById("submit-section-btn");
    if (btn) {
      var span = btn.querySelector("span");
      if (span) span.textContent = last ? "SUBMIT PAPER" : "SUBMIT SECTION";
      btn.setAttribute("onclick", last ? "submitPaper()" : "submitCurrentSection(true)");
    }
    var next = document.getElementById("next-btn");
    if (next && last) {
      var section = (data.sections || [])[idx];
      var qIdx = typeof window.currentQuestion === "number" ? window.currentQuestion : 0;
      if (section && qIdx >= (section.questions || []).length - 1) {
        next.innerHTML = 'Submit paper <i class="fa-solid fa-check ml-2"></i>';
      }
    }
  }

  function addSubmitBar() {
    if (document.getElementById("setpaper-submit-bar")) return;
    var exam = document.getElementById("exam-interface") || document.getElementById("test-ui");
    if (!exam) return;
    var bar = document.createElement("div");
    bar.id = "setpaper-submit-bar";
    bar.style.cssText = "position:sticky;bottom:0;z-index:40;margin-top:12px;padding:10px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;display:flex;gap:8px;";
    bar.innerHTML = '<button type="button" id="setpaper-submit-paper" style="flex:1;min-height:44px;border:0;border-radius:14px;background:#003366;color:#fff;font-weight:700;font-size:13px;">Submit paper</button><button type="button" id="setpaper-submit-section" style="flex:1;min-height:44px;border:1px solid #e2e8f0;border-radius:14px;background:#fff;color:#003366;font-weight:700;font-size:13px;">Submit section</button>';
    exam.appendChild(bar);
    document.getElementById("setpaper-submit-paper").onclick = function () { submitPaper(); };
    document.getElementById("setpaper-submit-section").onclick = function () { window.submitCurrentSection(true); };
  }

  var autoSent = false;
  function tickLock() {
    var bar = document.getElementById("setpaper-submit-bar");
    if (locked()) {
      if (bar) bar.style.display = "none";
      showLockNote();
      return;
    }
    if (bar) bar.style.display = "flex";
    var note = document.getElementById("setpaper-lock-note");
    if (note) note.style.display = "none";
    if (Number(window.__setpaperLockUntil || 0) > 0 && !autoSent) {
      autoSent = true;
      window.__setpaperLockUntil = 0;
      submitPaper();
    }
  }

  function bootLayout() {
    var timeEl = document.getElementById("setting-time");
    if (timeEl && window.examData) {
      var mins = 0;
      (window.examData.sections || []).forEach(function (s) { mins += Number(s.timeMinutes) || 0; });
      if (mins > 0) timeEl.value = String(Math.max(1, Math.round(mins)));
    }
    if (!window.__setpaperBooted && typeof window.startExam === "function" && document.getElementById("landing-page")) {
      window.__setpaperBooted = true;
      try { window.startExam(); } catch (err) {}
    }
    if (!window.__setpaperEmtWrap && typeof window.forceSubmit === "function") {
      window.__setpaperEmtWrap = true;
      var origForce = window.forceSubmit;
      window.forceSubmit = function () {
        if (locked()) {
          showLockNote();
          return;
        }
        try { origForce.apply(this, arguments); } catch (err) {}
        notifyHost("exam-complete", collectResults());
      };
    }
  }

  function install() {
    bootLayout();
    addSubmitBar();
    labelSubmit();
    tickLock();
    var tabs = document.getElementById("section-tabs");
    if (tabs && !tabs.__setpaperLabeled) {
      tabs.__setpaperLabeled = true;
      tabs.addEventListener("click", function () { setTimeout(labelSubmit, 0); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  setTimeout(install, 400);
  setInterval(tickLock, 400);
})();
<\/script>`;function P(e){let t=M(e);return t.includes(`window.__setpaperHost`)?t:/<\/body>/i.test(t)?t.replace(/<\/body>/i,N+`
</body>`):t+N}var F=j;async function I(n){if(!n||n.kind===`bundled`||typeof indexedDB>`u`)return j;try{let r=await t(e(n.id));if(r?.html)return r.html;let i=await t(`template`);if(i?.html)return i.html}catch{}return j}function L(e,t){return t===`as-written`?e:e.map(e=>{if(!e.options.length)return e;let n=e.options.map((e,t)=>t);if(t===`reverse`)n.reverse();else for(let e=n.length-1;e>0;e--){let t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}let r=n.map(t=>e.options[t]),i=e.correct;if(typeof i==`number`){let e=n.indexOf(i);i=e>=0?e:i}else Array.isArray(i)&&(i=i.map(e=>n.indexOf(e)).filter(e=>e>=0));return{...e,options:r,correct:i}})}function R(e,t){let n=e.sections.map((e,n)=>{let r=e.timeMinutes;return t.timerMode!==`off`&&t.extraMinutes>0&&n===0&&(r+=t.extraMinutes),{...e,timeMinutes:Math.max(1,r)}});return{...e,meta:{...e.meta,title:t.examTitle.trim()||e.meta.title,candidateName:t.candidateName.trim()||void 0,candidateId:t.candidateId.trim()||void 0},sections:n,settings:t}}function z(e){let t=[];for(let n of e.sections)for(let e of n.questions)t.push({id:Number(e.id)||t.length+1,bankId:e.bankId,question_en:e.question,options_en:e.options,answerIndex:typeof e.correct==`number`?e.correct:0,solution:e.explanation||``});return t}function B(e){return JSON.stringify(e).replace(/</g,`\\u003c`)}function V(e,t){let n=B(t);if(e.includes(`__EXAM_DATA__`))return P(e.replace(`__EXAM_DATA__`,n));let r=O(e,[`examData`]);if(r&&!r.placeholder)return P(e.slice(0,r.start)+n+e.slice(r.end));let i=O(e,[`raw_questions_data`,`questions_data`,`questions`]);if(i){let r=B(z(t)),a=e.slice(0,i.start)+r+e.slice(i.end);return/examData\s*=/.test(a)||(a=a.replace(/<head[^>]*>/i,e=>`${e}<script>var examData = window.examData = ${n};<\/script>`)),P(a)}return P(j.replace(`__EXAM_DATA__`,n))}export{R as a,S as c,I as i,x as l,L as n,C as o,V as r,T as s,F as t,D as u};