gsap.registerPlugin(ScrollTrigger);

let isPlaying = false;
const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700', '#da70d6', '#9370db', '#00ced1', '#ff6347', '#7b68ee', '#ff8c00'];

const planetMessages = {
    'Mercury': {
        title: 'Mercury - Swift & Close',
        message: 'Like Mercury orbiting closest to the sun, my heart stays closest to you. You are my first thought every morning and my last every night. Your love pulls me in with a gravity I cannot resist.'
    },
    'Venus': {
        title: 'Venus - Bright & Beautiful',
        message: 'You shine brighter than Venus in my sky. Your smile outshines every star, and your beauty eclipses all celestial wonders. In my universe, you are the brightest object of all.'
    },
    'Earth': {
        title: 'Earth - Home & Life',
        message: 'With you, I am home. You are the fertile soil where my love grows, the atmosphere that lets me breathe, and the only place in this vast universe where I truly belong.'
    },
    'Mars': {
        title: 'Mars - Passion & Fire',
        message: 'My passion for you burns like the red sands of Mars - eternal, fierce, and unyielding. It warms me in the cold of space and lights my way through the darkest nights.'
    }
};

window.addEventListener('load', () => {
    setTimeout(() => {
        gsap.to('#loader', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.getElementById('loader').style.display = 'none';
                initAnimations();
            }
        });
    }, 1500);
});

function initAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');

    bgMusic.volume = 0.2;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🎵';
            musicToggle.classList.remove('bg-pink-500/30');
        } else {
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
            musicIcon.textContent = '🔊';
            musicToggle.classList.add('bg-pink-500/30');
        }
        isPlaying = !isPlaying;
    });
}

function initStarfield() {
    const canvas = document.getElementById('starfield');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const isMobile = window.innerWidth < 768;
    const starsCount = isMobile ? 3000 : 6000;
    
    const starsGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(starsCount * 3);
    const colorArray = new Float32Array(starsCount * 3);

    for(let i = 0; i < starsCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i+1] = (Math.random() - 0.5) * 100;
        posArray[i+2] = (Math.random() - 0.5) * 100;

        const colorChoice = Math.random();
        if (colorChoice > 0.6) {
            colorArray[i] = 1;
            colorArray[i+1] = 0.4;
            colorArray[i+2] = 0.7;
        } else if (colorChoice > 0.85) {
            colorArray[i] = 1;
            colorArray[i+1] = 0.8;
            colorArray[i+2] = 0.2;
        } else {
            colorArray[i] = 1;
            colorArray[i+1] = 1;
            colorArray[i+2] = 1;
        }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.15 : 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0xffc0cb,
        emissive: 0xff69b4,
        emissiveIntensity: 0.3,
        shininess: 100
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(12, 8, -15);
    scene.add(moon);

    const moonLight = new THREE.PointLight(0xff69b4, 0.6, 100);
    moonLight.position.copy(moon.position);
    scene.add(moonLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    camera.position.z = 25;

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.0003;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.0003;
    });

    let frameCount = 0;
    function animate() {
        requestAnimationFrame(animate);
        frameCount++;
        
        if (isMobile && frameCount % 2 !== 0) return;
        
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        starsMesh.rotation.y += 0.0001;
        starsMesh.rotation.y += targetX * 0.5;
        starsMesh.rotation.x += targetY * 0.5;

        moon.rotation.y += 0.001;
        moon.position.y = 8 + Math.sin(Date.now() * 0.0005) * 1.5;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initSolarSystem() {
    const container = document.getElementById('solarSystem');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff1493,
        emissive: 0xff69b4,
        emissiveIntensity: 0.6,
        roughness: 0.4,
        metalness: 0.6
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const glowGeometry = new THREE.SphereGeometry(1.4, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff69b4,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const planets = [];
    const planetData = [
        { color: 0xffb6c1, size: 0.2, distance: 2.5, speed: 0.015, name: 'Mercury' },
        { color: 0xff69b4, size: 0.28, distance: 3.5, speed: 0.012, name: 'Venus' },
        { color: 0xff1493, size: 0.35, distance: 4.5, speed: 0.008, name: 'Earth' },
        { color: 0xc71585, size: 0.25, distance: 5.5, speed: 0.006, name: 'Mars' }
    ];

    planetData.forEach((data) => {
        const geometry = new THREE.MeshStandardMaterial({ 
            color: data.color,
            roughness: 0.7,
            metalness: 0.3
        });
        const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), geometry);
        
        const orbit = new THREE.Group();
        orbit.add(planet);
        planet.position.x = data.distance;
        
        scene.add(orbit);
        planets.push({ mesh: orbit, speed: data.speed, angle: Math.random() * Math.PI * 2, name: data.name });
    });

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    camera.position.z = 12;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    let eclipseActive = false;
    setInterval(() => {
        eclipseActive = !eclipseActive;
        const eclipseText = document.getElementById('eclipseText');
        if (eclipseActive) {
            gsap.to(eclipseText, { opacity: 1, duration: 1 });
            gsap.to(sunMaterial.emissive, { r: 0.3, g: 0, b: 0.1, duration: 2 });
        } else {
            gsap.to(eclipseText, { opacity: 0, duration: 1 });
            gsap.to(sunMaterial.emissive, { r: 1, g: 0.41, b: 0.71, duration: 2 });
        }
    }, 8000);

    function animate() {
        requestAnimationFrame(animate);
        sun.rotation.y += 0.005;
        glow.rotation.y -= 0.002;
        glow.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.1);

        planets.forEach((planet, index) => {
            planet.angle += planet.speed;
            planet.mesh.children[0].position.x = Math.cos(planet.angle) * (2.5 + index * 1);
            planet.mesh.children[0].position.z = Math.sin(planet.angle) * (2.5 + index * 1);
            planet.mesh.children[0].rotation.y += 0.005;
        });

        renderer.render(scene, camera);
    }
    animate();

    ScrollTrigger.create({
        trigger: "#universe",
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
            camera.position.x = Math.sin(self.progress * Math.PI) * 10;
            camera.position.z = Math.cos(self.progress * Math.PI) * 10;
            camera.lookAt(0, 0, 0);
        }
    });
}

function initPlanetCards() {
    const cards = document.querySelectorAll('.planet-card');
    const modal = document.getElementById('planetModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const closeModal = document.querySelector('.close-modal');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const planetName = card.dataset.planet;
            const data = planetMessages[planetName];
            
            if (data) {
                modalTitle.textContent = data.title;
                modalMessage.textContent = data.message;
                modal.classList.add('active');
                createSparkles(card);
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: fixed;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(sparkle);
        
        gsap.to(sparkle, {
            y: -50,
            opacity: 0,
            rotation: 360,
            duration: 1,
            onComplete: () => sparkle.remove()
        });
    }
}

function initTolulopeAnimation() {
    const container = document.getElementById('tolulopeCanvas');
    container.innerHTML = '';
    
    const letters = ['T', 'O', 'L', 'U', 'L', 'O', 'P', 'E'];
    const isMobile = window.innerWidth < 768;
    const letterWidth = isMobile ? 11 : 12;
    
    const letterConfigs = {
        'T': { dots: [[0.5, 0.1], [0.5, 0.4], [0.5, 0.7], [0.5, 0.9], [0.2, 0.1], [0.8, 0.1]] },
        'O': { dots: [[0.5, 0.15], [0.2, 0.35], [0.8, 0.35], [0.2, 0.65], [0.8, 0.65], [0.5, 0.85]] },
        'L': { dots: [[0.3, 0.1], [0.3, 0.4], [0.3, 0.7], [0.3, 0.9], [0.7, 0.9]] },
        'U': { dots: [[0.2, 0.15], [0.2, 0.4], [0.2, 0.7], [0.5, 0.85], [0.8, 0.15], [0.8, 0.4], [0.8, 0.7]] },
        'P': { dots: [[0.3, 0.1], [0.3, 0.4], [0.3, 0.7], [0.3, 0.9], [0.7, 0.2], [0.7, 0.4], [0.5, 0.3]] },
        'E': { dots: [[0.2, 0.1], [0.6, 0.1], [0.2, 0.5], [0.5, 0.5], [0.2, 0.9], [0.6, 0.9], [0.4, 0.5]] }
    };
    
    letters.forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'tolulope-letter';
        letterDiv.textContent = letter;
        letterDiv.style.left = `${5 + index * letterWidth}%`;
        letterDiv.style.top = '50%';
        container.appendChild(letterDiv);
        
        const config = letterConfigs[letter];
        if (config) {
            config.dots.forEach((pos, i) => {
                const planet = document.createElement('div');
                planet.className = 'planet-dot';
                planet.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                planet.style.width = isMobile ? '18px' : '24px';
                planet.style.height = isMobile ? '18px' : '24px';
                planet.style.left = `${5 + index * letterWidth + pos[0] * letterWidth}%`;
                planet.style.top = `${pos[1] * 100}%`;
                planet.dataset.finalLeft = planet.style.left;
                planet.dataset.finalTop = planet.style.top;
                
                planet.style.left = '50%';
                planet.style.top = '50%';
                
                container.appendChild(planet);
            });
        }
    });

    document.getElementById('alignPlanetsBtn').addEventListener('click', function() {
        this.style.display = 'none';
        
        const planets = container.querySelectorAll('.planet-dot');
        const letterElements = container.querySelectorAll('.tolulope-letter');
        
        planets.forEach((planet, i) => {
            setTimeout(() => {
                planet.style.left = planet.dataset.finalLeft;
                planet.style.top = planet.dataset.finalTop;
                planet.classList.add('formed');
            }, i * 80);
        });
        
        letterElements.forEach((letter, i) => {
            setTimeout(() => {
                letter.classList.add('filled');
            }, 400 + i * 150);
        });
        
        setTimeout(() => {
            gsap.to('#finalMessage', { opacity: 1, y: 0, duration: 1.5 });
            createGrandFinale();
        }, 2500);
    });
}

function initPhotoLayout() {
    const container = document.getElementById('photoVContainer');
    const photos = ['photo1.jpeg', 'photo2.jpeg', 'photo3.jpeg', 'photo4.jpeg', 'photo5.jpeg', 'photo6.jpeg', 'photo7.jpeg', 'photo8.jpeg'];

    const isMobile = window.innerWidth < 768;
    
    const positions = [
        { left: '3%', top: '5%', rotate: -8 },
        { left: '10%', top: '28%', rotate: -4 },
        { left: '5%', top: '55%', rotate: -6 },
        { left: '15%', top: '80%', rotate: -2 },
        { right: '3%', top: '5%', rotate: 8 },
        { right: '10%', top: '28%', rotate: 4 },
        { right: '5%', top: '55%', rotate: 6 },
        { right: '15%', top: '80%', rotate: 2 }
    ];

    photos.forEach((photo, index) => {
        const div = document.createElement('div');
        div.className = 'photo-item';
        
        if (positions[index].left) div.style.left = positions[index].left;
        if (positions[index].right) div.style.right = positions[index].right;
        div.style.top = positions[index].top;
        div.style.transform = `rotate(${positions[index].rotate}deg)`;
        div.style.animation = `float ${4 + Math.random() * 2}s ease-in-out infinite`;
        div.style.animationDelay = `${Math.random() * 2}s`;
        
        div.innerHTML = `<img src="${photo}" alt="Memory ${index + 1}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22250%22><rect fill=%22%23ff69b4%22 width=%22200%22 height=%22250%22/><text fill=%22white%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 font-size=%2216%22>Love ${index+1}</text></svg>'">`;
        
        container.appendChild(div);

        gsap.from(div, {
            scrollTrigger: { trigger: "#memories", start: "top 85%" },
            scale: 0, opacity: 0, rotation: positions[index].rotate + 20,
            duration: 1, delay: index * 0.1, ease: "back.out(1.7)"
        });
    });
}

function initConstellation() {
    const svg = document.getElementById('constellationSvg');
    const stars = [
        {x: 30, y: 25}, {x: 80, y: 15}, {x: 130, y: 30}, {x: 180, y: 20}, {x: 230, y: 28}, {x: 280, y: 18},
        {x: 55, y: 65}, {x: 105, y: 55}, {x: 155, y: 70}, {x: 205, y: 60}, {x: 255, y: 68}
    ];

    for (let i = 0; i < stars.length - 1; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', stars[i].x);
        line.setAttribute('y1', stars[i].y);
        line.setAttribute('x2', stars[i+1].x);
        line.setAttribute('y2', stars[i+1].y);
        line.setAttribute('class', 'constellation-line');
        line.style.animationDelay = `${i * 0.15}s`;
        svg.appendChild(line);
    }

    stars.forEach((star, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', star.x);
        circle.setAttribute('cy', star.y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', '#ff69b4');
        circle.setAttribute('class', 'star-twinkle');
        circle.style.animationDelay = `${index * 0.1}s`;
        svg.appendChild(circle);
    });
}

function initScrollTrain() {
    const train = document.getElementById('scrollTrain');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateTrain() {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const topPos = 10 + (scrollPercent * 80);
        const wobble = Math.sin(Date.now() / 500) * 2;
        
        train.style.top = `${topPos}%`;
        train.style.transform = `translateY(-50%) translateX(${wobble}px)`;
        
        const scrollDirection = window.scrollY > lastScrollY ? 5 : -5;
        train.querySelector('.train-body').style.transform = `rotate(${scrollDirection}deg)`;
        
        lastScrollY = window.scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateTrain);
            ticking = true;
        }
    }, { passive: true });
}

function initAnimations() {
    gsap.to('#heroSubtitle', { opacity: 1, y: 0, duration: 1.5, delay: 0.3 });
    gsap.to('#heroButtons', { opacity: 1, y: 0, duration: 1.5, delay: 0.6 });
    gsap.to('#audioVisualizer', { opacity: 1, duration: 1, delay: 0.9 });
    gsap.to('#scrollHint', { opacity: 1, duration: 1, delay: 1.2 });

    const visualizer = document.getElementById('audioVisualizer');
    for (let i = 0; i < 6; i++) {
        const bar = document.createElement('div');
        bar.className = 'audio-bar';
        bar.style.animationDelay = `${i * 0.1}s`;
        bar.style.height = `${8 + Math.random() * 20}px`;
        visualizer.appendChild(bar);
    }

    gsap.utils.toArray('.love-line').forEach((line, i) => {
        gsap.to(line, {
            scrollTrigger: { trigger: line, start: "top 90%" },
            opacity: 1, x: 0, duration: 1, delay: i * 0.15, ease: "power2.out"
        });
    });

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            gsap.to('#heroTitle', { x: moveX, y: moveY, duration: 1 });
        });
    }
}

function createGrandFinale() {
    const finaleColors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffd700', '#ff6347', '#da70d6', '#9370db', '#00ced1'];
    
    for (let wave = 0; wave < 4; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 25; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    const startX = Math.random() * window.innerWidth;
                    const startY = Math.random() * window.innerHeight;
                    
                    particle.style.cssText = `
                        position: fixed;
                        left: ${startX}px;
                        top: ${startY}px;
                        width: ${5 + Math.random() * 6}px;
                        height: ${5 + Math.random() * 6}px;
                        background: ${finaleColors[Math.floor(Math.random() * finaleColors.length)]};
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 9999;
                        box-shadow: 0 0 8px currentColor;
                    `;
                    document.body.appendChild(particle);

                    const angle = Math.random() * Math.PI * 2;
                    const velocity = 80 + Math.random() * 150;
                    
                    gsap.to(particle, {
                        x: Math.cos(angle) * velocity,
                        y: Math.sin(angle) * velocity,
                        opacity: 1,
                        scale: 1.3,
                        duration: 0.6,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(particle, {
                                opacity: 0,
                                scale: 0,
                                duration: 1,
                                onComplete: () => particle.remove()
                            });
                        }
                    });
                }, i * 25);
            }
        }, wave * 350);
    }

    setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 0px;
            z-index: 10000;
            pointer-events: none;
            filter: drop-shadow(0 0 20px rgba(255, 105, 180, 0.8));
        `;
        document.body.appendChild(heart);

        gsap.to(heart, {
            fontSize: window.innerWidth < 768 ? '250px' : '350px',
            opacity: 0,
            duration: 2.5,
            ease: "elastic.out(1, 0.3)",
            onComplete: () => heart.remove()
        });
    }, 1500);

    const texts = ['TOLULOPE', 'I LOVE YOU', 'FOREVER'];
    texts.forEach((text, i) => {
        setTimeout(() => {
            const el = document.createElement('div');
            el.textContent = text;
            el.style.cssText = `
                position: fixed;
                left: 50%;
                top: ${30 + Math.random() * 40}%;
                transform: translate(-50%, -50%);
                font-family: 'Great Vibes', cursive;
                font-size: 0px;
                color: #ff69b4;
                text-shadow: 0 0 15px rgba(255, 105, 180, 0.8);
                z-index: 9998;
                pointer-events: none;
                white-space: nowrap;
            `;
            document.body.appendChild(el);

            gsap.to(el, {
                fontSize: window.innerWidth < 768 ? '50px' : '70px',
                opacity: 0,
                duration: 1.8,
                ease: "power2.out",
                onComplete: () => el.remove()
            });
        }, 800 + i * 500);
    });
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function initMouseTrail() {
    let lastTrail = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrail > 100) {
            lastTrail = now;
            const isHeart = Math.random() > 0.6;
            const trail = document.createElement('div');
            trail.innerHTML = isHeart ? '💖' : '✨';
            trail.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-size: ${isHeart ? '14px' : '10px'};
                pointer-events: none;
                z-index: 9999;
                opacity: 0.7;
            `;
            document.body.appendChild(trail);

            gsap.to(trail, {
                y: e.clientY + 40,
                x: (Math.random() - 0.5) * 20,
                opacity: 0,
                rotation: Math.random() * 360,
                duration: 1.2,
                onComplete: () => trail.remove()
            });
        }
    });
}

function initAll() {
    initAudio();
    initStarfield();
    initSolarSystem();
    initPlanetCards();
    initPhotoLayout();
    initConstellation();
    initTolulopeAnimation();
    initScrollTrain();
    initMouseTrail();
}

initAll();