let currentPet = null;

window.addEventListener('DOMContentLoaded', () => {
    const bgBirds = document.querySelectorAll('.illustration-bg img');
    let petX = 0, petY = 0; 
    let targetX = 0, targetY = 0; 

    // --- 1. 定义创建宠物的统一函数 (保持你的原始样式设置) ---
    function initPet(imgSrc) {
        if (currentPet) currentPet.remove();
        
        currentPet = document.createElement('img');
        currentPet.src = imgSrc; 
        currentPet.className = 'mouse-pet';
        document.body.appendChild(currentPet);

        Object.assign(currentPet.style, {
            position: 'fixed',
            zIndex: '10000',
            width: '50px',
            height: 'auto',
            pointerEvents: 'none',
            animation: 'none',
            transition: 'opacity 0.3s ease'
        });
    }

    // --- 2. 跨页面恢复：检查本地存储 ---
    const savedPet = localStorage.getItem('activeMousePet');
    if (savedPet) {
        initPet(savedPet);
    }

    // --- 3. 点击 Grid 换鸟逻辑 ---
    bgBirds.forEach(bird => {
        bird.addEventListener('click', function(e) {
            const clickedImgSrc = this.src;
            this.src = './assets/blankbird.png';
            this.style.opacity = "1";

            // 存入本地存储，实现全局应用
            localStorage.setItem('activeMousePet', clickedImgSrc);

            initPet(clickedImgSrc);
            
            // 瞬间对准位置，防止从 0,0 飞过来
            petX = e.clientX; petY = e.clientY; 
        });
    });

    // --- 4. 监听鼠标移动 ---
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // --- 5. 平滑动画循环 (保留你喜欢的丝滑感) ---
    function smoothFollow() {
        if (currentPet) {
            const ease = 0.15;
            petX += (targetX - petX) * ease;
            petY += (targetY - petY) * ease;
            
            // 减去图片宽度的一半 (25px) 保持中心对齐
            currentPet.style.left = `${petX - 25}px`; 
            currentPet.style.top = `${petY - 25}px`; 
        }
        requestAnimationFrame(smoothFollow);
    }
    smoothFollow();
});









    // === 交互 2：Bouncing Robin 点击冒爱心 ===

    // 这里的选择器需根据你 HTML 的结构，比如 .bouncing_robin 标签
    const bouncingRobin = document.querySelector('.bouncing_robin'); 

    if (bouncingRobin) {
        bouncingRobin.addEventListener('click', function(e) {
            // 测试：控制台打印消息
            console.log("爱心爆发！");
            
            // 每次点击生成多个爱心
            const heartCount = 15; // 产生 15 个爱心
            for (let i = 0; i < heartCount; i++) {
                createHeart(e.clientX, e.clientY);
            }
        });
    }

    // 生成单个爱心的辅助函数
    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        // 使用 Unicode 爱心符号 ♥
        heart.innerHTML = '♥'; 
        
        // 生成随机属性使爱心各不相同
        const size = Math.random() * 20 + 30; // 10-30px
        const velocityX = (Math.random() - 0.5) * 6; // -3 到 3 的水平速度
        const velocityY = -(Math.random() * 4 + 4); // -4 到 -8 的向上初速度
        const rotation = Math.random() * 360; // 随机初始角度

        document.body.appendChild(heart);

        // 初始化爱心样式
        Object.assign(heart.style, {
            position: 'fixed',
            left: `${x - size/2}px`,
            top: `${y - size/2}px`,
            fontSize: `${size}px`,
            color: 'var(--accent-orange)', 
            filter: 'drop-shadow(0 2px 4px rgba(255,216,176,0.3))',
            pointerEvents: 'none', // 不影响点击
            zIndex: '10001',      // 位于宠物之上
            transform: `rotate(${rotation}deg)`
        });

        // 将参数存储在元素上供动画使用
        heart.dataset.velocityX = velocityX;
        heart.dataset.velocityY = velocityY;
        heart.dataset.rotation = rotation;

        // 设置随机动画时间 (1.5-2.5秒) 并在时间到后移除
        const duration = Math.random() * 1000 + 1500;
        setTimeout(() => heart.remove(), duration);

        // 使用物理动画让爱心飞舞和淡出
        animateHeart(heart);
    }

    // 爱心物理动画辅助函数
    function animateHeart(heart) {
        if (!heart.isConnected) return; // 如果已被移除，停止

        let vx = parseFloat(heart.dataset.velocityX);
        let vy = parseFloat(heart.dataset.velocityY);
        let rot = parseFloat(heart.dataset.rotation);

        vy += 0.3; // 重力模拟 (下坠)
        vx *= 0.98; // 空气阻力 (减速)
        
        const x = parseFloat(heart.style.left) + vx;
        const y = parseFloat(heart.style.top) + vy;
        
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // 缓慢旋转和淡出
        rot += (vx * 2); 
        heart.dataset.rotation = rot;
        heart.style.transform = `rotate(${rot}deg) scale(1)`; 
        
        // 增加平滑的透明度变化
        requestAnimationFrame(() => animateHeart(heart));
    }

   
   function playVideo(container) {
    const video = container.querySelector('video');
    
    if (video.paused) {
        video.play();
        container.classList.add('is-playing');
    } else {
        video.pause();
        container.classList.remove('is-playing');
    }
}


// 确保 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    initMangaAudioPlayers();
});

function initMangaAudioPlayers() {
    // 寻找页面上所有的音频卡片
    const allAudioCards = document.querySelectorAll('.audio-card');

    allAudioCards.forEach((card, index) => {
        // 1. 获取当前卡片内部的特定元素
        const audio = card.querySelector('.manga-audio');
        const playBtn = card.querySelector('.play-pause-btn');
        const progressWrapper = card.querySelector('.manga-progress-wrapper');
        const progressFill = card.querySelector('.manga-progress-fill');
        const timeDisplay = card.querySelector('.time-display');
        
        // 获取 SVG 内部的 path 以便切换图标
        const playPath = card.querySelector('svg path') || card.querySelector('.play-path');

        // 图标数据 (SVG Path)
        const ICON_PLAY = "M8 5v14l11-7z";
        const ICON_PAUSE = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

        if (!audio || !playBtn) return; // 安全检查

        // 2. 播放/暂停点击逻辑
        playBtn.onclick = function(e) {
            e.preventDefault();

            // 【可选】播放当前时，停止其他正在播放的音频
            document.querySelectorAll('.manga-audio').forEach(other => {
                if (other !== audio && !other.paused) {
                    other.pause();
                    const otherCard = other.closest('.audio-card');
                    const otherPath = otherCard.querySelector('svg path');
                    if (otherPath) otherPath.setAttribute('d', ICON_PLAY);
                }
            });

            if (audio.paused) {
                audio.play().catch(err => console.warn("播放受阻:", err));
                if (playPath) playPath.setAttribute('d', ICON_PAUSE);
            } else {
                audio.pause();
                if (playPath) playPath.setAttribute('d', ICON_PLAY);
            }
        };

        // 3. 进度条更新逻辑
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                if (progressFill) progressFill.style.width = percent + "%";
                
                // 时间显示 00:00
                const mins = Math.floor(audio.currentTime / 60).toString().padStart(2, '0');
                const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
                if (timeDisplay) timeDisplay.innerText = `${mins}:${secs}`;
            }
        };

        // 4. 进度条点击跳转逻辑
        if (progressWrapper) {
            progressWrapper.onclick = function(e) {
                const rect = progressWrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                if (audio.duration) {
                    audio.currentTime = percentage * audio.duration;
                }
            };
        }
        
        // 5. 音频结束自动重置图标
        audio.onended = function() {
            if (playPath) playPath.setAttribute('d', ICON_PLAY);
            if (progressFill) progressFill.style.width = "0%";
        };
    });
}