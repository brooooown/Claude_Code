document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const screens = document.querySelectorAll('.screen');
    const navTabs = document.querySelectorAll('.nav-tab');
    const searchTab = document.querySelector('.search-tab');
    const allTabs = document.querySelectorAll('[data-tab]');

    // 状態管理
    let currentScreen = 'home';
    let prevTab = null;
    let FULL_HEIGHT = window.innerHeight;

    // 初期化
    init();

    function init() {
        // 初期画面設定
        showScreen(currentScreen);

        // イベントリスナーの設定
        setupEventListeners();

        // キーボード対応の初期化
        setupKeyboardHandling();

        // サブタブの初期化
        setupSubTabs();

        console.log('iOS App Prototype initialized');
    }

    function setupEventListeners() {
        // メインナビゲーションタブ
        navTabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
            tab.addEventListener('touchend', handleTabClick);
        });

        // 検索タブ
        searchTab.addEventListener('click', handleTabClick);
        searchTab.addEventListener('touchend', handleTabClick);

        // フィルターチップ
        document.addEventListener('click', handleChipClick);

        // サブタブ
        document.addEventListener('click', handleSubTabClick);

        // 検索フォーム
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('focus', handleSearchFocus);
            searchInput.addEventListener('blur', handleSearchBlur);
        }

        // ウィンドウリサイズ
        window.addEventListener('resize', handleResize);
    }

    function handleTabClick(e) {
        e.preventDefault();

        const tabId = this.getAttribute('data-tab');
        if (!tabId || tabId === currentScreen) return;

        // ハプティックフィードバック
        vibrate(10);

        // タブ切り替え
        switchToScreen(tabId);
    }

    function switchToScreen(screenId) {
        const currentScreenElement = document.getElementById(currentScreen);
        const targetScreenElement = document.getElementById(screenId);

        if (!targetScreenElement) return;

        // 前の画面を記録
        prevTab = currentScreen;

        // 画面切り替えアニメーション
        animateScreenTransition(currentScreenElement, targetScreenElement, screenId);

        // ナビゲーション状態更新
        updateNavigation(screenId);

        // 現在の画面を更新
        currentScreen = screenId;
    }

    function animateScreenTransition(currentEl, targetEl, direction) {
        // 現在の画面を隠す
        currentEl.classList.remove('active');

        // 目標画面を表示
        setTimeout(() => {
            targetEl.classList.add('active');

            // スクロール位置をリセット
            const content = targetEl.querySelector('.screen-content');
            if (content) {
                content.scrollTop = 0;
            }
        }, 50);
    }

    function updateNavigation(activeTab) {
        // 全てのタブから active クラスを削除
        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // アクティブなタブに active クラスを追加
        const activeTabElement = document.querySelector(`[data-tab="${activeTab}"]`);
        if (activeTabElement) {
            activeTabElement.classList.add('active');
        }
    }

    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        updateNavigation(screenId);
    }

    // フィルターチップの処理
    function handleChipClick(e) {
        if (e.target.classList.contains('chip')) {
            const container = e.target.parentElement;
            const chips = container.querySelectorAll('.chip');

            chips.forEach(chip => chip.classList.remove('active'));
            e.target.classList.add('active');

            vibrate(5);
        }
    }

    // サブタブの処理
    function handleSubTabClick(e) {
        if (e.target.classList.contains('tab-btn')) {
            const container = e.target.parentElement;
            const tabs = container.querySelectorAll('.tab-btn');

            tabs.forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');

            vibrate(5);
        }
    }

    function setupSubTabs() {
        // サブタブの初期化（各画面で独立）
        const subTabContainers = document.querySelectorAll('.tab-bar-sub');

        subTabContainers.forEach(container => {
            const firstTab = container.querySelector('.tab-btn');
            if (firstTab) {
                firstTab.classList.add('active');
            }
        });
    }

    // キーボード対応
    function setupKeyboardHandling() {
        // visualViewport API対応
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportResize);
        }

        // フォールバック: ウィンドウリサイズ
        window.addEventListener('resize', debounce(handleResize, 100));

        // スクロール防止
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    function handleViewportResize() {
        const currentHeight = window.visualViewport.height;
        const isKeyboardVisible = currentHeight < FULL_HEIGHT * 0.75;

        document.body.style.setProperty('--keyboard-height',
            `${FULL_HEIGHT - currentHeight}px`);

        if (isKeyboardVisible) {
            document.body.classList.add('keyboard-visible');
            adjustForKeyboard();
        } else {
            document.body.classList.remove('keyboard-visible');
            resetKeyboardAdjustments();
        }
    }

    function adjustForKeyboard() {
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            bottomNav.style.transform = 'translateY(100px)';
            bottomNav.style.opacity = '0.5';
        }

        // 検索画面の場合は検索フォームを上部に固定
        if (currentScreen === 'search') {
            const searchForm = document.querySelector('.search-form');
            if (searchForm) {
                searchForm.style.position = 'sticky';
                searchForm.style.top = '0';
                searchForm.style.zIndex = '20';
                searchForm.style.background = '#fff';
                searchForm.style.paddingBottom = '10px';
            }
        }

        // スクロール位置調整
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }

    function resetKeyboardAdjustments() {
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            bottomNav.style.transform = '';
            bottomNav.style.opacity = '';
        }

        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.style.position = '';
            searchForm.style.top = '';
            searchForm.style.zIndex = '';
            searchForm.style.background = '';
            searchForm.style.paddingBottom = '';
        }
    }

    function handleSearchFocus() {
        // 検索フォーカス時の処理
        setTimeout(() => {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 300);
    }

    function handleSearchBlur() {
        // 検索ブラー時の処理
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }

    function handleResize() {
        // ウィンドウリサイズ時の処理
        const newHeight = window.innerHeight;
        const heightDiff = FULL_HEIGHT - newHeight;

        if (heightDiff > 150) { // キーボードが表示されていると判断
            adjustForKeyboard();
        } else {
            resetKeyboardAdjustments();
            FULL_HEIGHT = newHeight; // 基準高さを更新
        }
    }

    function handleTouchMove(e) {
        // 特定の要素以外でのスクロールを防ぐ
        const scrollableElements = [
            '.screen-content',
            '.filter-chips',
            '.carousel',
            '.brand-grid'
        ];

        let isScrollable = false;

        scrollableElements.forEach(selector => {
            if (e.target.closest(selector)) {
                isScrollable = true;
            }
        });

        if (!isScrollable) {
            e.preventDefault();
        }
    }

    // ユーティリティ関数
    function vibrate(duration = 10) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }

    function debounce(func, wait) {
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

    // 追加のインタラクション
    function addInteractionEffects() {
        // グリッドアイテムのタップ効果
        document.addEventListener('click', (e) => {
            if (e.target.closest('.grid-item')) {
                vibrate(5);
                // 商品詳細表示の処理をここに追加できる
            }
        });

        // カルーセルカードのタップ効果
        document.addEventListener('click', (e) => {
            if (e.target.closest('.carousel-card')) {
                vibrate(5);
                // カード詳細表示の処理をここに追加できる
            }
        });

        // 履歴カードのタップ効果
        document.addEventListener('click', (e) => {
            if (e.target.closest('.history-card')) {
                vibrate(5);
                // 検索実行の処理をここに追加できる
            }
        });

        // アクションボタンの処理
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                vibrate(10);
                // アクション実行の処理をここに追加できる
            }
        });
    }

    // 初期化完了後にインタラクション効果を追加
    addInteractionEffects();

    // パフォーマンス最適化
    function optimizeScrolling() {
        const scrollableElements = document.querySelectorAll('.screen-content, .filter-chips, .carousel, .brand-grid');

        scrollableElements.forEach(element => {
            element.addEventListener('scroll', debounce(() => {
                // スクロール終了時の処理
                element.style.willChange = 'auto';
            }, 150));

            element.addEventListener('touchstart', () => {
                element.style.willChange = 'scroll-position';
            });
        });
    }

    optimizeScrolling();

    // デバイス回転対応
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            FULL_HEIGHT = window.innerHeight;
            handleResize();
        }, 500);
    });

    // PWA風のスワイプジェスチャー（オプション）
    function setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        const threshold = 50; // スワイプ閾値

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // 水平スワイプの場合のみ処理
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // 左スワイプ: 次の画面
                    swipeToNext();
                } else {
                    // 右スワイプ: 前の画面
                    swipeToPrev();
                }
            }
        }, { passive: true });
    }

    function swipeToNext() {
        const tabOrder = ['home', 'list', 'auction', 'wallet', 'search'];
        const currentIndex = tabOrder.indexOf(currentScreen);
        const nextIndex = (currentIndex + 1) % tabOrder.length;
        switchToScreen(tabOrder[nextIndex]);
    }

    function swipeToPrev() {
        const tabOrder = ['home', 'list', 'auction', 'wallet', 'search'];
        const currentIndex = tabOrder.indexOf(currentScreen);
        const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
        switchToScreen(tabOrder[prevIndex]);
    }

    // スワイプジェスチャーを有効化（必要に応じて）
    // setupSwipeGestures();
});