/**
 * nav.js - 统一导航栏加载与动效脚本
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 自动寻找页面中的占位符并加载导航栏
    const placeholder = document.getElementById('nav-placeholder');
    
    if (placeholder) {
        // 注意：如果你的项目有子文件夹，建议使用绝对路径 '/nav.html'
        fetch('nav.html') 
            .then(response => {
                if (!response.ok) throw new Error('导航栏文件加载失败');
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                // 2. HTML 加载完成后，立即初始化滚动效果
                initNavScrollEffect();
            })
            .catch(err => console.error('Nav Loader Error:', err));
    }
});

/**
 * 核心动效：滚动时收缩，停止滚动后恢复
 */
function initNavScrollEffect() {
    const nav = document.querySelector('.top-nav-container');
    if (!nav) return;

    let scrollTimer = null;

    window.addEventListener('scroll', () => {
        // 只要向下滚动超过 50px
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            
            // 清除之前的计时器
            clearTimeout(scrollTimer);

            // 设置新计时器：停止滚动 1200ms 后移除类名
            scrollTimer = setTimeout(() => {
                // 如果你希望停下就恢复：
                nav.classList.remove('scrolled');
            }, 800); 
        } else {
            // 回到页面最顶端，立即恢复
            nav.classList.remove('scrolled');
        }
    });
}