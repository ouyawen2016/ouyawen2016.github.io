// ========================================
// 全局函数 - 绑定到window对象
// ========================================
// 滚动到关于我部分
window.scrollToAbout = function() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const offsetTop = aboutSection.offsetTop - 80; // 考虑导航栏高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// ========================================
// 主程序入口
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能模块
    initNavbar();
    initSmoothScrolling();
    initCarousel();
    initPositionIndicator();
    initModals();
    initFormHandling();
});

// ========================================
// 导航栏功能模块
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 监听滚动事件，实现导航栏缩放
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 平滑滚动功能模块
// ========================================
function initSmoothScrolling() {
    // 为所有内部链接添加平滑滚动
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 轮播图功能模块
// ========================================
function initCarousel() {
    const carousel = document.getElementById('carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let autoPlayInterval;
    let isModalOpen = false;
    
    // 检查模态框是否开启
    function checkModalState() {
        const modals = document.querySelectorAll('.modal');
        isModalOpen = Array.from(modals).some(modal => modal.classList.contains('show'));
        console.log('Modal state check:', isModalOpen); // 调试信息
    }
    
    // 显示指定幻灯片
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // 跳转到指定幻灯片
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }
    
    // 开始自动播放
    function startAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        autoPlayInterval = setInterval(() => {
            checkModalState();
            if (!isModalOpen) {
                nextSlide();
            }
        }, 5000);
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // 绑定按钮事件
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // 绑定指示器事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // 监听模态框状态变化
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('project-card')) {
            // 点击卡片时停止自动播放
            console.log('Card clicked, stopping autoplay');
            stopAutoPlay();
        }
    });
    
    // 监听模态框关闭事件
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close') || e.target.classList.contains('modal')) {
            // 模态框关闭后重新开始自动播放
            console.log('Modal closed, restarting autoplay');
            setTimeout(() => {
                checkModalState();
                if (!isModalOpen) {
                    startAutoPlay();
                }
            }, 100);
        }
    });
    
    // 监听模态框显示事件
    document.addEventListener('click', (e) => {
        if (e.target.onclick && e.target.onclick.toString().includes('openModal')) {
            // 点击打开模态框时停止自动播放
            console.log('Opening modal, stopping autoplay');
            stopAutoPlay();
        }
    });
    
    // 开始自动播放
    startAutoPlay();
    
    // 初始化显示第一张幻灯片
    showSlide(0);
}

// ========================================
// 位置指示器功能模块
// ========================================
function initPositionIndicator() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const homeSection = document.getElementById('home');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100; // 考虑导航栏高度
        
        // 如果在首页部分，不激活任何导航链接
        if (homeSection) {
            const homeTop = homeSection.offsetTop;
            const homeHeight = homeSection.offsetHeight;
            const homeBottom = homeTop + homeHeight;
            
            if (scrollPos >= homeTop && scrollPos < homeBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                return;
            }
        }
        
            // 检查其他部分
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;
                
                // 跳过首页部分
                if (section.id === 'home') return;
                
                // 检查当前滚动位置是否在某个部分内
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    // 调整索引，因为跳过了首页
                    const adjustedIndex = section.id === 'about' ? 0 : 
                                       section.id === 'work' ? 1 :
                                       section.id === 'passion' ? 2 :
                                       section.id === 'contact' ? 3 : index;
                    navLinks[adjustedIndex].classList.add('active');
                }
            });
        
        // 如果滚动到页面底部，激活最后一个导航链接
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[navLinks.length - 1].classList.add('active');
        }
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', updateActiveNavLink);
    
    // 初始化
    updateActiveNavLink();
}

// ========================================
// 模态框功能模块
// ========================================
function initModals() {
    // 全局函数，供HTML调用
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto'; // 恢复滚动
        }
    };
    
    // 点击模态框背景关闭
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('show')) {
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
}

// ========================================
// 表单处理功能模块
// ========================================
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // 简单的表单验证
            if (!name || !email || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            // 模拟表单提交
            alert('感谢您的留言！我会尽快回复您。');
            this.reset();
        });
    }
}

// 邮箱验证工具函数
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// 滚动动画效果模块
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.section, .project-card, .skill-column');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// 视频播放功能模块
// ========================================
function initVideoHandling() {
    const video = document.querySelector('.intro-video');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (video && videoOverlay) {
        videoOverlay.addEventListener('click', function() {
            video.play();
            this.style.display = 'none';
        });
        
        video.addEventListener('pause', function() {
            videoOverlay.style.display = 'block';
        });
    }
}

// ========================================
// 响应式导航菜单（移动端）模块
// ========================================
function initMobileMenu() {
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    
    // 创建移动端菜单按钮
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.display = 'none';
    
    navbar.querySelector('.nav-container').appendChild(mobileMenuBtn);
    
    // 切换移动端菜单
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-menu-open');
    });
    
    // 响应式处理
    function handleResize() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            navMenu.classList.add('mobile-menu');
        } else {
            mobileMenuBtn.style.display = 'none';
            navMenu.classList.remove('mobile-menu', 'mobile-menu-open');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
}

// ========================================
// 页面加载完成后的初始化
// ========================================
window.addEventListener('load', function() {
    initScrollAnimations();
    initVideoHandling();
    initMobileMenu();
});

// ========================================
// 工具函数
// ========================================
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动性能 - 使用节流函数
const throttledScrollHandler = throttle(function() {
    // 这里可以添加需要节流的滚动处理逻辑
}, 16); // 约60fps

window.addEventListener('scroll', throttledScrollHandler);
