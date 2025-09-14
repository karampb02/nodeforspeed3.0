document.addEventListener('DOMContentLoaded', () => {

    // --- PROJECT 1: API-POWERED PALETTE GENERATOR ---
    (function () {
        const generatePaletteBtn = document.getElementById('generate-palette-btn');
        const paletteContainer = document.querySelector('.palette-container');
        const tooltip = document.getElementById('copy-tooltip');
        const url = "http://colormind.io/api/";
        const data = { model: "default" };

        async function getPalette() {
            paletteContainer.innerHTML = 'Loading...';
            try {
                const response = await fetch(url, { method: "POST", body: JSON.stringify(data) });
                const { result } = await response.json();
                paletteContainer.innerHTML = '';
                result.forEach(color => {
                    const hex = rgbToHex(color[0], color[1], color[2]);
                    const colorDiv = document.createElement('div');
                    colorDiv.classList.add('color-box');
                    colorDiv.style.backgroundColor = hex;
                    colorDiv.textContent = hex;
                    colorDiv.addEventListener('click', () => copyToClipboard(hex));
                    paletteContainer.appendChild(colorDiv);
                });
            } catch (error) {
                paletteContainer.innerHTML = 'Failed to load palette.';
                console.error('Error fetching palette:', error);
            }
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                tooltip.style.opacity = 1;
                setTimeout(() => { tooltip.style.opacity = 0; }, 1500);
            });
        }

        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

        generatePaletteBtn.addEventListener('click', getPalette);
        getPalette();
    })();

    // --- PROJECT 2: PIXEL ART CANVAS ---
    (function () {
        const canvas = document.getElementById('pixel-canvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('color-picker');
        const clearGridBtn = document.getElementById('clear-grid-btn');
        const exportBtn = document.getElementById('export-btn');
        const PIXEL_SIZE = 20;
        const GRID_SIZE = canvas.width / PIXEL_SIZE;

        function drawGrid() {
            ctx.strokeStyle = '#2D2D2D';
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    ctx.strokeRect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                }
            }
        }

        function clearCanvas() {
            ctx.fillStyle = '#1E1E1E';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawGrid();
        }

        let isDrawing = false;
        canvas.addEventListener('mousedown', (e) => { isDrawing = true; draw(e); });
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);
        canvas.addEventListener('mousemove', draw);

        function draw(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
            const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
            ctx.fillStyle = colorPicker.value;
            ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }

        exportBtn.addEventListener('click', () => {
            exportBtn.href = canvas.toDataURL('image/png');
            exportBtn.download = 'pixel-art.png';
        });

        clearGridBtn.addEventListener('click', clearCanvas);
        clearCanvas();
    })();

    // --- PROJECTS 3, 4, 5 (Existing Logic) ---
    // Minimal changes needed for these as they are already robust.
    (function () { // Haiku
        const btn = document.getElementById('generate-haiku-btn'), cont = document.querySelector('.haiku-container');
        const words = { one: ['sun', 'sky', 'tree', 'pond', 'leaf', 'rain', 'wind', 'moon'], two: ['river', 'flower', 'meadow', 'forest', 'winter', 'summer'], three: ['beautiful', 'wonderful', 'serenity'] };
        const getWord = s => { const k = s == 1 ? 'one' : s == 2 ? 'two' : 'three'; return words[k][Math.floor(Math.random() * words[k].length)]; };
        const genLine = sC => { let l = '', sL = sC; while (sL > 0) { let sCh = Math.min(sL, Math.ceil(Math.random() * 3)); l += getWord(sCh) + ' '; sL -= sCh; } return l.trim(); };
        const genHaiku = () => { cont.innerHTML = `<p>${genLine(5)}</p><p>${genLine(7)}</p><p>${genLine(5)}</p>`; };
        btn.addEventListener('click', genHaiku); genHaiku();
    })();

    (function () { // CSS Pattern
        const disp = document.querySelector('.pattern-display'), out = document.querySelector('.css-output'), ctrls = document.querySelector('.pattern-controls');
        const genPat = () => { const s = document.getElementById('size-slider').value, c1 = document.getElementById('p-color-1').value, c2 = document.getElementById('p-color-2').value; const css = `background:repeating-linear-gradient(45deg,${c1},${c1} ${s}px,${c2} ${s}px,${c2} ${2 * s}px);`; disp.style = css; out.value = css; };
        ctrls.addEventListener('input', genPat); genPat();
    })();

    (function () { // Story Prompt
        const btn = document.getElementById('generate-prompt-btn'), cont = document.querySelector('.prompt-container');
        const c = ['A nervous knight', 'A cheerful wizard', 'A retired space captain'], s = ['in a spooky library', 'on a forgotten moon', 'at a magical university'], g = ['who must find a lost book.', 'who wants to bake the perfect cake.', 'trying to solve a mysterious crime.'];
        const getR = a => a[Math.floor(Math.random() * a.length)];
        const genP = () => { cont.innerHTML = `<p>"${getR(c)} ${getR(s)} ${getR(g)}"</p>`; };
        btn.addEventListener('click', genP); genP();
    })();

    // --- NAVIGATION LOGIC ---
    (function () {
        const navButtons = document.querySelectorAll('nav button');
        const projects = document.querySelectorAll('.project');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                projects.forEach(project => project.hidden = project.id !== targetId);
                navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === targetId));
            });
        });
    })();
});