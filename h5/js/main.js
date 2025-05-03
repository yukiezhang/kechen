// main.js - 处理所有页面交互和导航功能

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，准备初始化页面...');
    
    // 初始化页面显示
    initPages();
    
    // 初始化导航按钮
    initNavigation();
    
    // 初始化音频播放器
    initAudioPlayer();
    
    // 初始化各页面特定功能
    initIntroPage();
    initExpensesPage();
    initQuestion1Page();
    initNeedsWantsPage();
    initGoalsQuizPage();
    initEmergencyFundPage();
    initBudgetMethodsPage();
    initBudgetQuizPage();
    initDecisionPracticePage();
    initCourseSummaryPage();
    initCourseCompletionPage();
});

// 页面管理和导航功能
// -----------------------------

// 初始化页面，只显示首页
function initPages() {
    console.log('初始化页面...');
    
    // 首先移除所有页面上的active类
    const allPages = document.querySelectorAll('.course-page');
    allPages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // 获取并显示首页
    const introPage = document.getElementById('page-intro');
    if (introPage) {
        console.log('找到首页，设置为可见');
        introPage.style.display = 'block';
        introPage.classList.add('active'); // 添加active类使其可见
        
        // 强制覆盖CSS中定义的透明度
        introPage.style.opacity = '1';
    } else {
        console.error('未找到首页元素(#page-intro)!');
    }

    
}

// 初始化导航按钮功能
function initNavigation() {
    console.log('初始化导航按钮...');
    
    // 处理下一步按钮
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextPageId = this.getAttribute('data-next');
            if (nextPageId) {
                navigateToPage(nextPageId);
            }
        });
    });
    
    // 处理返回按钮
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevPageId = this.getAttribute('data-prev');
            if (prevPageId) {
                navigateToPage(prevPageId);
            }
        });
    });
    
    // 处理首页的开始按钮
    const startButton = document.getElementById('start-course-btn');
    if (startButton) {
        startButton.addEventListener('click', function() {
            const nextPageId = this.getAttribute('data-next');
            if (nextPageId) {
                navigateToPage(nextPageId);
            }
        });
    }
}

// 导航到指定页面
// 导航到指定页面
function navigateToPage(pageId) {
    console.log('导航到页面:', pageId);
    
    // 隐藏所有页面
    const pages = document.querySelectorAll('.course-page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        console.log('找到目标页面，设置为可见');
        targetPage.style.display = 'block';
        targetPage.classList.add('active'); // 添加active类
        targetPage.style.opacity = '1'; // 强制设置透明度为1
        
        // 获取页面音频并播放
        const audioSrc = targetPage.getAttribute('data-audio');
        if (audioSrc) {
            const audioElement = document.getElementById('page-audio');
            audioElement.src = audioSrc;
            audioElement.load();
            
            // 播放音频并更新播放按钮显示
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // 播放成功，更新UI
                    document.querySelector('.play-icon').style.display = 'none';
                    document.querySelector('.pause-icon').style.display = 'inline';
                })
                .catch(error => {
                    // 自动播放被阻止，可能需要用户交互
                    console.log('自动播放被阻止:', error);
                    document.querySelector('.play-icon').style.display = 'inline';
                    document.querySelector('.pause-icon').style.display = 'none';
                });
            }
        }
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    } else {
        console.error('未找到目标页面:', pageId);
    }
}

// 音频播放器功能
// -----------------------------
function initAudioPlayer() {
    const audioElement = document.getElementById('page-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const muteBtn = document.getElementById('mute-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    // 播放/暂停功能
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (audioElement.paused) {
                const playPromise = audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'inline';
                    })
                    .catch(error => {
                        console.error('播放失败:', error);
                    });
                }
            } else {
                audioElement.pause();
                playIcon.style.display = 'inline';
                pauseIcon.style.display = 'none';
            }
        });
    }
    
    // 静音功能
    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            audioElement.muted = !audioElement.muted;
            this.textContent = audioElement.muted ? '🔇' : '🔊';
        });
    }
    
    // 更新进度条和时间显示
    if (audioElement) {
        audioElement.addEventListener('timeupdate', function() {
            // 更新进度条
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressFill.style.width = progress + '%';
            
            // 更新时间显示
            currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
        });
        
        // 加载元数据后更新总时长
        audioElement.addEventListener('loadedmetadata', function() {
            durationDisplay.textContent = formatTime(audioElement.duration);
        });
        
        // 音频结束事件
        audioElement.addEventListener('ended', function() {
            // 重置播放按钮
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        });
    }
    
    // 格式化时间显示
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }
    
    // 尝试在页面加载后播放当前页面的音频
    window.addEventListener('DOMContentLoaded', function() {
        // 获取当前活动页面
        const activePage = document.querySelector('.course-page.active');
        if (activePage) {
            const audioSrc = activePage.getAttribute('data-audio');
            if (audioSrc) {
                audioElement.src = audioSrc;
                audioElement.load();
                
                // 尝试自动播放
                const playPromise = audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // 播放成功
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'inline';
                    })
                    .catch(error => {
                        // 自动播放被阻止
                        console.log('自动播放需要用户交互:', error);
                        playIcon.style.display = 'inline';
                        pauseIcon.style.display = 'none';
                    });
                }
            }
        }
    });
}

// 各页面特定功能
// -----------------------------

// 首页初始化
function initIntroPage() {
    // 首页特定代码（如果需要）
}

// 支出页面初始化 - 收据查看功能
function initExpensesPage() {
    // 收据数据
    const receipts = {
        receipt1: {
            title: "午餐收据",
            date: "2023年5月10日",
            items: [
                { name: "三明治", price: 8 },
                { name: "苹果", price: 3 },
                { name: "薯片", price: 5 },
                { name: "果汁", price: 5 }
            ],
            total: 21,
            note: "小磊：我以为午餐只花了15元。实际花了比我记忆中多得多！"
        },
        receipt2: {
            title: "电子游戏收据",
            date: "2023年4月28日",
            items: [
                { name: "游戏", price: 69 }
            ],
            total: 69,
            note: "小磊：我以为游戏只花了50元，结果是69元！"
        },
        receipt3: {
            title: "电影收据",
            date: "2023年5月5日",
            items: [
                { name: "电影票", price: 30 },
                { name: "爆米花", price: 8 },
                { name: "汽水", price: 5 },
                { name: "糖果", price: 5 }
            ],
            total: 48,
            note: "小磊：我以为电影只花了25元。比我想的贵多了！"
        },
        receipt4: {
            title: "漫画书收据",
            date: "2023年5月2日",
            items: [
                { name: "漫画（3本）", price: 15 },
                { name: "图画小说", price: 20 }
            ],
            total: 35,
            note: "小磊：我以为漫画书只花了25元。天哪，实际多了这么多！"
        },
        receipt5: {
            title: "杂项收据",
            date: "2023年5月1日-15日",
            items: [
                { name: "零食", price: 18 },
                { name: "手机贴膜", price: 15 },
                { name: "公交费", price: 12 },
                { name: "文具", price: 10 }
            ],
            total: 55,
            note: "小磊：这些小支出我都没记，但它们累计起来金额不小！"
        }
    };

    // 获取页面元素
    const modal = document.getElementById('receipt-modal');
    const closeModal = document.querySelector('.close-modal');
    const hotspots = document.querySelectorAll('.map-hotspot');
    
    // 显示收据函数
    function showReceipt(receiptId) {
        const receiptData = receipts[receiptId];
        if (!receiptData) {
            console.error('找不到收据数据:', receiptId);
            return;
        }
        
        const receiptContent = document.getElementById('receipt-content');
        
        // 构建收据HTML
        let receiptHtml = `
            <div class="receipt">
                <div class="receipt-header">
                    <h3>${receiptData.title}</h3>
                    <p>日期: ${receiptData.date}</p>
                </div>
                <div class="receipt-items">
        `;
        
        // 添加收据项目
        receiptData.items.forEach(item => {
            receiptHtml += `
                <div class="receipt-item">
                    <span>${item.name}</span>
                    <span>¥${item.price}</span>
                </div>
            `;
        });
        
        // 添加总计和备注
        receiptHtml += `
                </div>
                <div class="receipt-total">
                    <span>总计</span>
                    <span>¥${receiptData.total}</span>
                </div>
                <p class="receipt-note">${receiptData.note}</p>
            </div>
        `;
        
        // 设置收据内容并显示模态框
        receiptContent.innerHTML = receiptHtml;
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
    
    // 设置热点点击事件
    if (hotspots.length > 0) {
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', function() {
                const receiptId = this.getAttribute('data-receipt');
                showReceipt(receiptId);
            });
        });
    }
    
    // 关闭模态框
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            modal.classList.remove('active');
        });
    }
    
    // 点击模态框外部关闭
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }
        });
    }
}

// 互动问答页面初始化
function initQuestion1Page() {
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const feedbackBox = document.getElementById('feedback-box');
    const nextButton = document.querySelector('#page-question1 .next-btn');
    
    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', function() {
            const selectedOption = document.querySelector('input[name="reason-q"]:checked');
            
            if (!selectedOption) {
                alert('请选择一个答案');
                return;
            }
            
            const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
            
            if (isCorrect) {
                feedbackBox.innerHTML = '<strong>回答正确！</strong> 没有记录支出是钱不够的主要原因。';
                feedbackBox.classList.add('success');
                feedbackBox.classList.remove('error');
                nextButton.disabled = false;
            } else {
                feedbackBox.innerHTML = '<strong>再试一次。</strong> 想想小磊为什么不知道他的钱去哪了。';
                feedbackBox.classList.add('error');
                feedbackBox.classList.remove('success');
            }
            
            // 显示反馈
            feedbackBox.style.display = 'block';
        });
    }
}

// 需求与欲望页面初始化
function initNeedsWantsPage() {
    // 获取拖放元素
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkButton = document.getElementById('check-sorting');
    const feedbackBox = document.getElementById('sorting-feedback');
    const nextButton = document.querySelector('#page-needs-wants .next-btn');
    
    // 设置拖放状态
    let draggedItem = null;
    let itemsDropped = 0;
    const totalItems = dragItems.length;
    
    // 为拖拽项添加事件
    if (dragItems.length > 0) {
        dragItems.forEach(item => {
            // 确保每个拖动项有唯一ID
            if (!item.id) {
                item.id = `drag-${Math.random().toString(36).substr(2, 9)}`;
            }
            
            // 拖动开始事件
            item.addEventListener('dragstart', function(e) {
                draggedItem = this;
                e.dataTransfer.setData('text/plain', this.id);
                this.classList.add('dragging');
            });
            
            // 拖动结束事件
            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });
    }
    
    // 为放置区域添加事件
    if (dropZones.length > 0) {
        dropZones.forEach(zone => {
            // 允许放置
            zone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('active');
            });
            
            // 离开放置区域
            zone.addEventListener('dragleave', function() {
                this.classList.remove('active');
            });
            
            // 放置事件
            zone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('active');
                
                const id = e.dataTransfer.getData('text/plain');
                const item = document.getElementById(id);
                
                if (item) {
                    // 如果项目已经在另一个区域，需要减少计数
                    if (item.parentElement && item.parentElement.classList.contains('drop-zone')) {
                        item.parentElement.removeChild(item);
                        itemsDropped--;
                    }
                    
                    // 添加到当前区域
                    this.appendChild(item);
                    itemsDropped++;
                    
                    // 检查是否所有项目都已放置
                    if (itemsDropped === totalItems) {
                        checkButton.disabled = false;
                    }
                }
            });
        });
    }
    
    // 检查分类按钮点击事件
    if (checkButton) {
        checkButton.addEventListener('click', function() {
            // 获取需求和欲望区域
            const needsZone = document.getElementById('needs-zone');
            const wantsZone = document.getElementById('wants-zone');
            
            // 获取各区域内的项目
            const needItems = needsZone.querySelectorAll('.drag-item');
            const wantItems = wantsZone.querySelectorAll('.drag-item');
            
            // 检查分类是否正确
            let correctCount = 0;
            let totalItems = 0;
            
            needItems.forEach(item => {
                totalItems++;
                if (item.getAttribute('data-category') === 'need') {
                    correctCount++;
                }
            });
            
            wantItems.forEach(item => {
                totalItems++;
                if (item.getAttribute('data-category') === 'want') {
                    correctCount++;
                }
            });
            
            const allCorrect = correctCount === totalItems;
            
            if (allCorrect) {
                feedbackBox.innerHTML = '<strong>分类正确！</strong> 你已经理解了需求和欲望的区别。';
                feedbackBox.classList.add('success');
                feedbackBox.classList.remove('error');
                nextButton.disabled = false;
            } else {
                feedbackBox.innerHTML = '<strong>有些项目分类不正确。</strong> 需求是生活必需的，欲望是想要但不必需的。';
                feedbackBox.classList.add('error');
                feedbackBox.classList.remove('success');
            }
            
            // 显示反馈
            feedbackBox.style.display = 'block';
        });
    }
}

// 财务目标测验页面初始化
function initGoalsQuizPage() {
    // 获取元素
    const checkButton = document.getElementById('check-goal-answer');
    const quizResult = document.getElementById('quiz-result');
    const explanation = document.getElementById('explanation');
    const nextButton = document.getElementById('goals-next-btn');
    
    // 添加检查按钮事件
    if (checkButton) {
        checkButton.addEventListener('click', function() {
            // 获取选择的答案
            const selectedOption = document.querySelector('input[name="goal-type"]:checked');
            
            if (!selectedOption) {
                alert('请选择一个答案');
                return;
            }
            
            // 获取结果元素
            const resultHeader = quizResult.querySelector('.result-header');
            const resultContent = quizResult.querySelector('.result-content');
            
            // 检查答案是否正确
            const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
            
            // 清除之前的类
            quizResult.classList.remove('success', 'error');
            resultHeader.classList.remove('success', 'error');
            
            if (isCorrect) {
                // 设置成功反馈
                resultHeader.textContent = '正确！';
                resultHeader.classList.add('success');
                resultContent.innerHTML = '小磊每周赚100元，在4周内就能攒够400元购票的钱，因此这是一个短期财务目标。';
                quizResult.classList.add('success');
                
                // 显示解释
                explanation.style.display = 'flex';
                explanation.classList.add('fade-in');
                
                // 启用下一步按钮
                nextButton.disabled = false;
                
                // 禁用选项和检查按钮
                disableOptions('goal-type');
                checkButton.disabled = true;
            } else {
                // 设置错误反馈
                resultHeader.textContent = '再思考一下';
                resultHeader.classList.add('error');
                resultContent.innerHTML = '考虑一下小磊需要多长时间才能存够这笔钱？如果每周赚100元，要存够400元需要多久？';
                quizResult.classList.add('error');
            }
            
            // 显示结果
            quizResult.style.display = 'block';
            quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // 添加动画
            quizResult.classList.add('fade-in');
        });
    }
    
    // 选项选择事件
    const options = document.querySelectorAll('#page-goals-quiz .option');
    if (options.length > 0) {
        options.forEach(option => {
            option.addEventListener('click', function() {
                // 移除所有选项的选中样式
                options.forEach(opt => opt.classList.remove('selected'));
                // 添加选中样式到当前选项
                this.classList.add('selected');
            });
        });
    }
    
    // 禁用选项函数
    function disableOptions(name) {
        const options = document.querySelectorAll(`input[name="${name}"]`);
        options.forEach(option => {
            if (!option.checked) {
                option.disabled = true;
                option.parentElement.style.opacity = '0.5';
                option.parentElement.style.cursor = 'default';
            }
        });
    }
}

// 应急基金页面初始化
function initEmergencyFundPage() {
    // 获取元素
    const emergencyCards = document.querySelectorAll('.emergency-card');
    const nextButton = document.getElementById('emergency-next-btn');
    const successMessage = document.getElementById('success-message');
    
    // 跟踪已查看的卡片
    let viewedCards = 0;
    const totalCards = emergencyCards.length;
    
    // 为每张卡片添加点击事件
    if (emergencyCards.length > 0) {
        emergencyCards.forEach(card => {
            card.addEventListener('click', function() {
                // 切换翻转状态
                this.classList.toggle('flipped');
                
                // 如果是首次查看该卡片
                if (!this.classList.contains('viewed')) {
                    this.classList.add('viewed');
                    viewedCards++;
                    
                    // 检查是否所有卡片都已查看
                    if (viewedCards === totalCards) {
                        // 显示成功信息
                        successMessage.style.display = 'block';
                        successMessage.classList.add('fade-in');
                        
                        // 启用下一步按钮
                        nextButton.disabled = false;
                        nextButton.classList.add('pulse');
                        
                        // 一段时间后移除脉冲效果
                        setTimeout(() => {
                            nextButton.classList.remove('pulse');
                        }, 2000);
                    }
                }
            });
        });
    }
}

// 预算方法页面初始化
function initBudgetMethodsPage() {
    // 获取标签页元素
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 默认选中第一个标签
    if (tabLinks.length > 0) {
        tabLinks[0].classList.add('active');
        const firstTabId = tabLinks[0].getAttribute('data-tab');
        const firstTab = document.getElementById(firstTabId);
        if (firstTab) {
            firstTab.classList.add('active');
        }
    }
    
    // 添加标签切换事件
    if (tabLinks.length > 0) {
        tabLinks.forEach(link => {
            link.addEventListener('click', function() {
                // 移除所有标签的活动状态
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // 添加活动状态到当前标签
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }
}

// 预算测验页面初始化
function initBudgetQuizPage() {
    const checkButton = document.getElementById('check-budget-answer');
    const feedbackElement = document.getElementById('feedback-budget-question');
    const explanationContainer = document.getElementById('explanation-container');
    const nextButton = document.getElementById('budget-next-btn');
    
    if (checkButton) {
        checkButton.addEventListener('click', function() {
            const selectedOption = document.querySelector('input[name="budget-question"]:checked');
            if (!selectedOption) {
                alert('请选择一个答案');
                return;
            }
            
            const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
            
            if (isCorrect) {
                feedbackElement.textContent = '正确！';
                feedbackElement.className = 'feedback success';
                explanationContainer.style.display = 'block';
                nextButton.disabled = false;
            } else {
                feedbackElement.textContent = '不正确，请再试一次。';
                feedbackElement.className = 'feedback error';
            }
            
            feedbackElement.style.display = 'block';
        });
    }
}

// 决策练习页面初始化
function initDecisionPracticePage() {
    // 决策数据
    let decisionState = {
        currentSavings: 500,
        decisions: [],
        currentScenario: "scenario1"
    };
    
    // 更新储蓄显示
    function updateSavingsDisplay() {
        const savingsDisplay = document.querySelector('.savings-display');
        if (savingsDisplay) {
            savingsDisplay.textContent = `¥${decisionState.currentSavings}`;
            
            // 添加动画效果
            savingsDisplay.classList.add('update');
            setTimeout(() => {
                savingsDisplay.classList.remove('update');
            }, 500);
        }
    }
    
    // 显示下一个场景
    function showNextScenario(scenarioId) {
        // 隐藏当前场景
        const currentScenario = document.getElementById(decisionState.currentScenario);
        if (currentScenario) {
            currentScenario.style.display = 'none';
        }
        
        // 显示下一个场景
        const nextScenario = document.getElementById(scenarioId);
        if (nextScenario) {
            nextScenario.style.display = 'block';
            nextScenario.classList.add('fade-in');
        }
        
        // 更新当前场景
        decisionState.currentScenario = scenarioId;
    }
    
    // 显示结果
    function showResult() {
        // 隐藏当前场景
        const currentScenario = document.getElementById(decisionState.currentScenario);
        if (currentScenario) {
            currentScenario.style.display = 'none';
        }
        
        // 获取结果容器
        const resultContainer = document.getElementById('result');
        
        // 构建结果内容
        let resultHtml = `
            <h3 class="scenario-title">决策总结</h3>
            <div class="decision-summary">
                <h3>你的决策结果</h3>
                
                <p class="summary-savings">剩余储蓄: <strong>¥${decisionState.currentSavings}</strong></p>
                
                <h4>你的决策：</h4>
                <ul class="summary-decisions">
        `;
        
        // 添加每个决策
        decisionState.decisions.forEach(decision => {
            resultHtml += `
                <li>
                    ${decision.text}
                    <span class="decision-cost">花费: ¥${decision.cost}</span>
                </li>
            `;
        });
        
        resultHtml += `
                </ul>
                
                <div class="decision-evaluation">
        `;
        
        // 根据剩余储蓄添加评价
        if (decisionState.currentSavings >= 400) {
            resultHtml += `
                <p class="excellent">恭喜！你已经存够了过山车票的钱，而且还有额外储蓄应对紧急情况。</p>
            `;
        } else if (decisionState.currentSavings >= 350) {
            resultHtml += `
                <p class="good">做得很好！你几乎存够了过山车票的钱，只需再努力一点点。</p>
            `;
        } else if (decisionState.currentSavings >= 250) {
            resultHtml += `
                <p class="fair">不错的开始，但你需要更注意节约开支才能实现目标。</p>
            `;
        } else {
            resultHtml += `
                <p class="poor">你的消费超出预算，需要重新评估你的支出习惯才能实现目标。</p>
            `;
        }
        
        resultHtml += `
                </div>
            </div>
        `;
        
        // 设置结果内容
        if (resultContainer) {
            resultContainer.innerHTML = resultHtml;
            
            // 显示结果
            resultContainer.style.display = 'block';
            resultContainer.classList.add('fade-in');
            
            // 启用继续按钮
            const continueBtn = document.getElementById('decision-continue-btn');
            if (continueBtn) {
                continueBtn.disabled = false;
            }
            
            // 如果成功达成目标，添加庆祝效果
            if (decisionState.currentSavings >= 400) {
                setTimeout(() => {
                    createConfetti();
                }, 1000);
            }
        }
    }
    
    // 创建庆祝效果
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
        
        const colors = ['#4763E4', '#FFC107', '#4CAF50', '#F44336', '#FF9800'];
        
        // 创建100个彩色碎片
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.top = '-10px';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            confetti.style.opacity = Math.random().toString();
            
            // 设置动画的随机偏移和旋转
            confetti.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
            confetti.style.setProperty('--r', (Math.random() * 360) + 'deg');
            
            // 添加动画
            confetti.style.animation = 'confetti 3s ease-in forwards';
            confetti.style.animationDelay = (Math.random() * 2) + 's';
            
            confettiContainer.appendChild(confetti);
        }
        
        // 3秒后移除
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    }
    
    // 设置决策选项事件监听
    const options = document.querySelectorAll('.decision-option');
    if (options.length > 0) {
        options.forEach(option => {
            option.addEventListener('click', function() {
                // 获取决策成本和下一个场景
                const cost = parseInt(this.getAttribute('data-cost'));
                const nextScenario = this.getAttribute('data-next');
                const decisionText = this.querySelector('.decision-text').textContent;
                
                // 更新储蓄
                decisionState.currentSavings -= cost;
                
                // 记录决策
                decisionState.decisions.push({
                    text: decisionText,
                    cost: cost,
                    scenario: decisionState.currentScenario
                });
                
                // 更新显示
                updateSavingsDisplay();
                
                // 如果是最终结果，显示总结
                if (nextScenario === "result") {
                    showResult();
                } else {
                    // 否则显示下一个场景
                    showNextScenario(nextScenario);
                }
            });
        });
    }
    
    // 初始化更新储蓄显示
    updateSavingsDisplay();
}

// 课程总结页面初始化
function initCourseSummaryPage() {
    // 为课程要点添加动画
    const lessons = document.querySelectorAll('.lesson-item');
    
    // 如果浏览器支持IntersectionObserver
    if ('IntersectionObserver' in window && lessons.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        lessons.forEach(lesson => {
            observer.observe(lesson);
        });
    } else {
        // 如果不支持，直接添加动画类
        lessons.forEach((lesson, index) => {
            setTimeout(() => {
                lesson.classList.add('animated');
            }, index * 200);
        });
    }
}

// 课程完成页面初始化
function initCourseCompletionPage() {
    // 检测页面显示状态以触发庆祝效果
    function checkAndCelebrate() {
        const completionPage = document.getElementById('page-course-completion');
        if (completionPage && getComputedStyle(completionPage).display === 'block') {
            console.log('课程完成页面显示，触发庆祝效果');
            setTimeout(() => {
                createConfetti();
            }, 800);
        }
    }
    
    // 监听页面导航事件
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('next-btn')) {
            if (e.target.getAttribute('data-next') === 'page-course-completion') {
                // 延迟检查，等待页面导航完成
                setTimeout(checkAndCelebrate, 100);
            }
        }
    });
    
    // 创建庆祝效果
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
        
        const colors = ['#4763E4', '#FFC107', '#4CAF50', '#F44336', '#FF9800'];
        
        // 创建50个彩色碎片
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.top = '-10px';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            confetti.style.opacity = Math.random().toString();
            
            // 添加动画
            confetti.style.animation = 'confetti 3s ease-in forwards';
            confetti.style.animationDelay = (Math.random() * 2) + 's';
            
            confettiContainer.appendChild(confetti);
        }
        
        // 5秒后移除
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    }
}