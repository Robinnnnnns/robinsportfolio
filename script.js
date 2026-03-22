// 全局记录当前跟随鼠标的克隆体，方便后续操作
let currentPet = null;

window.addEventListener('DOMContentLoaded', () => {
    // === 交互 1：克隆分身随鼠 (不改变 Grid) ===

    // 获取所有背景插画
    const bgBirds = document.querySelectorAll('.illustration-bg img');
    let petX = 0, petY = 0; // 存储平滑位置
    let targetX = 0, targetY = 0; // 存储目标位置

    bgBirds.forEach(bird => {
        bird.addEventListener('click', function(e) {
            // 原位逻辑：点击的鸟变 blankbird
            const clickedImgSrc = this.src;
            this.src = './assets/blankbird.png';
            this.style.opacity = "1";

            // 宠物逻辑：移除旧的，生成新的“克隆分身”
            if (currentPet) {
                currentPet.remove();
            }
            currentPet = document.createElement('img');
            currentPet.src = clickedImgSrc; 
            currentPet.className = 'mouse-pet';
            document.body.appendChild(currentPet);

            // 初始样式 (脱离文档流，最顶层)
            Object.assign(currentPet.style, {
                position: 'fixed',
                zIndex: '10000',      // 必须在所有内容之上
                width: '50px',        // 比原本稍微大一点点
                height: 'auto',
                pointerEvents: 'none', // 核心：不拦截鼠标点击其他元素
                animation: 'none',     // 停止原有的 Grid 呼吸动画
                transition: 'opacity 0.3s ease' // 配合消失效果
            });
            petX = e.clientX; petY = e.clientY; // 初始对准
        });
    });

    // 监听鼠标移动，实现克隆体平滑跟随
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // 平滑动画循环 (让跟随动作有惯性)
    function smoothFollow() {
        if (currentPet) {
            // 平滑因子，数值越小越平滑
            const ease = 0.15;
            petX += (targetX - petX) * ease;
            petY += (targetY - petY) * ease;
            
            currentPet.style.left = `${petX - 21}px`; // 减去宽度一半
            currentPet.style.top = `${petY - 21}px`; // 减去高度一半
        }
        requestAnimationFrame(smoothFollow);
    }
    smoothFollow(); // 启动平滑跟随循环


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
        const size = Math.random() * 20 + 10; // 10-30px
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
            color: 'var(--accent-lemon)', // 使用你的柠檬黄主题色
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
});