document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションの初期化
    const navItems = document.querySelectorAll('.nav-item');
    const currentTabName = document.getElementById('current-tab-name');

    // タブ名の日本語マッピング
    const tabNames = {
        home: 'ホーム',
        auction: 'オークション',
        sell: '出品',
        wallet: 'おサイフ',
        search: '検索'
    };

    // リップル効果を作成する関数
    function createRipple(element, event) {
        const ripple = element.querySelector('.nav-ripple');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // リップルアニメーション
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.left = centerX + 'px';
        ripple.style.top = centerY + 'px';

        requestAnimationFrame(() => {
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (centerX - size/2) + 'px';
            ripple.style.top = (centerY - size/2) + 'px';
            ripple.style.opacity = '1';

            setTimeout(() => {
                ripple.style.opacity = '0';
                setTimeout(() => {
                    ripple.style.width = '0px';
                    ripple.style.height = '0px';
                }, 200);
            }, 300);
        });
    }

    // 液体的な背景変形効果
    function animateBackground(activeItem) {
        const navBackground = document.querySelector('.nav-background');
        const navContainer = document.querySelector('.nav-container');
        const rect = activeItem.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();

        // 活性化されたアイテムの位置に基づいて背景を変形
        const relativeX = rect.left - containerRect.left + rect.width / 2;
        const relativePosition = relativeX / containerRect.width;

        // CSS変数で位置を制御
        navBackground.style.setProperty('--active-position', `${relativePosition * 100}%`);

        // 波のような効果
        navBackground.style.transform = `scaleY(${activeItem.classList.contains('center-item') ? 1.1 : 1})`;

        setTimeout(() => {
            navBackground.style.transform = 'scaleY(1)';
        }, 300);
    }

    // ハプティックフィードバック（対応デバイスのみ）
    function vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }

    // タブ切り替え関数
    function switchTab(targetTab, clickedElement) {
        // 全てのアイテムから active クラスを削除
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // クリックされたアイテムに active クラスを追加
        clickedElement.classList.add('active');

        // タブ名を更新
        if (currentTabName) {
            currentTabName.textContent = tabNames[targetTab] || targetTab;

            // タブ名の色変化アニメーション
            currentTabName.style.transform = 'scale(1.1)';
            currentTabName.style.color = '#FFD700';

            setTimeout(() => {
                currentTabName.style.transform = 'scale(1)';
            }, 200);
        }

        // 背景アニメーション
        animateBackground(clickedElement);

        // ハプティックフィードバック
        vibrate();

        // 液体的な波紋効果
        createLiquidWave(clickedElement);
    }

    // 液体的な波紋効果
    function createLiquidWave(element) {
        const wave = document.createElement('div');
        wave.className = 'liquid-wave';
        wave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: -1;
        `;

        element.appendChild(wave);

        // アニメーション
        requestAnimationFrame(() => {
            wave.style.width = '120px';
            wave.style.height = '120px';
            wave.style.opacity = '1';

            setTimeout(() => {
                wave.style.opacity = '0';
                setTimeout(() => {
                    if (wave.parentNode) {
                        wave.parentNode.removeChild(wave);
                    }
                }, 500);
            }, 600);
        });
    }

    // イベントリスナーの設定
    navItems.forEach(item => {
        // クリックイベント
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabType = this.getAttribute('data-tab');

            // リップル効果
            createRipple(this, e);

            // タブ切り替え
            setTimeout(() => {
                switchTab(tabType, this);
            }, 100);
        });

        // タッチイベント（モバイル対応）
        let touchStartTime;

        item.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            this.style.transform = this.classList.contains('center-item')
                ? 'translateY(-12px) scale(0.95)'
                : 'translateY(-2px) scale(0.95)';
        }, { passive: true });

        item.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;

            // 短いタッチの場合のみクリック処理
            if (touchDuration < 200) {
                const tabType = this.getAttribute('data-tab');
                createRipple(this, e);

                setTimeout(() => {
                    switchTab(tabType, this);
                }, 50);
            }

            // 元の状態に戻す
            this.style.transform = '';
        }, { passive: true });
    });

    // 周期的な液体アニメーション
    function createPeriodicLiquidEffect() {
        const navBackground = document.querySelector('.nav-background');
        const intensity = Math.sin(Date.now() * 0.002) * 0.02 + 1;

        navBackground.style.transform = `scale(${intensity})`;

        requestAnimationFrame(createPeriodicLiquidEffect);
    }

    // 液体効果を開始
    createPeriodicLiquidEffect();

    // インターセクションオブザーバーでスクロール時の効果
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const navContainer = document.querySelector('.nav-container');
            if (entry.isIntersecting) {
                navContainer.style.transform = 'translateY(0)';
                navContainer.style.opacity = '1';
            } else {
                navContainer.style.transform = 'translateY(10px)';
                navContainer.style.opacity = '0.9';
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px'
    });

    // 液体的なエンハンスメント
    function addLiquidEnhancements() {
        const navBackground = document.querySelector('.nav-background');

        // グラデーション効果を追加
        const gradientOverlay = document.createElement('div');
        gradientOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%,
                rgba(255, 255, 255, 0.05) 100%);
            border-radius: inherit;
            pointer-events: none;
        `;
        navBackground.appendChild(gradientOverlay);

        // 輝く効果
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg,
                transparent 30%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 70%);
            transform: translateX(-100%);
            animation: shimmer 3s infinite ease-in-out;
            border-radius: inherit;
            pointer-events: none;
        `;
        navBackground.appendChild(shimmer);

        // キーフレームアニメーション
        if (!document.getElementById('shimmer-animation')) {
            const style = document.createElement('style');
            style.id = 'shimmer-animation';
            style.textContent = `
                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) rotate(45deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 初期化
    addLiquidEnhancements();

    // パフォーマンス最適化: throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // スムーズなアニメーション制御
    const optimizedAnimation = throttle(createPeriodicLiquidEffect, 16); // 60fps

    console.log('Liquid Glass Navigation initialized successfully! 🌊');
});