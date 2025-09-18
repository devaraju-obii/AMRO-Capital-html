/**
 * Anmol Real Estate - Dashboard JavaScript
 * Author: Cascade
 * Date: 2025-09-18
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dashboard components
    initSidebar();
    initCharts();
    initDropdowns();
    initNotifications();
    
    // Add resize event listener to update charts when window size changes
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Redraw charts that need spacing adjustments
            if (document.getElementById('barChart')) {
                createBarChart();
            }
            if (document.getElementById('incomeChart')) {
                createIncomeChart();
            }
        }, 250); // Debounce to avoid excessive redraws
    });
});

/**
 * Sidebar Toggle Functionality
 * Handles responsive sidebar behavior
 */
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const dashboardMain = document.querySelector('.dashboard-main');
    
    if (!sidebarToggle || !sidebar) return;
    
    // Add overlay for mobile sidebar
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Add overlay styles
    const overlayStyles = document.createElement('style');
    overlayStyles.textContent = `
        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 90;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .sidebar-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        body.sidebar-open {
            overflow: hidden;
        }
        
        @media (max-width: 768px) {
            .sidebar {
                width: 85%;
                max-width: 280px;
            }
        }
    `;
    document.head.appendChild(overlayStyles);
    
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    });
    
    // Close sidebar when clicking on overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
}

/**
 * Initialize Chart.js Charts
 * Creates and configures all dashboard charts
 */
function initCharts() {
    // Set Chart.js defaults for all charts
    Chart.defaults.color = '#b3b3b3';
    Chart.defaults.font.family = "'Libre Franklin', sans-serif";
    Chart.defaults.elements.line.borderWidth = 2;
    Chart.defaults.elements.point.radius = 3;
    Chart.defaults.elements.point.hoverRadius = 5;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(22, 22, 32, 0.9)';
    Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold' };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.borderColor = '#252535';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.legend.labels.padding = 20;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.position = 'bottom';
    
    // Developer Dashboard Charts
    if (document.getElementById('lineChart')) {
        createLineChart();
    }
    
    if (document.getElementById('pieChart')) {
        createPieChart();
    }
    
    if (document.getElementById('barChart')) {
        createBarChart();
    }
    
    // Investor Dashboard Charts
    if (document.getElementById('performanceChart')) {
        createPerformanceChart();
    }
    
    if (document.getElementById('allocationChart')) {
        createAllocationChart();
    }
    
    if (document.getElementById('incomeChart')) {
        createIncomeChart();
    }
}

/**
 * Line Chart for Project Progress (Developer Dashboard)
 */
function createLineChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(106, 90, 205, 0.4)');
    gradient.addColorStop(1, 'rgba(106, 90, 205, 0)');
    
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
            label: 'Project Completion Rate',
            data: [45, 52, 49, 60, 55, 65, 70, 75, 78],
            borderColor: '#6a5acd',
            backgroundColor: gradient,
            tension: 0.3,
            fill: true
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: '#252535',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Completion: ${context.parsed.y}%`;
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

/**
 * Pie Chart for Project Categories (Developer Dashboard)
 */
function createPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    const data = {
        labels: ['Residential', 'Commercial', 'Mixed Use', 'Industrial'],
        datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: [
                '#2196f3',
                '#4caf50',
                '#9c27b0',
                '#ff9800'
            ],
            borderWidth: 0
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        boxWidth: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

/**
 * Bar Chart for Revenue by Project (Developer Dashboard)
 */
function createBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;
    
    const data = {
        labels: ['Skyline Residences', 'Horizon Office Tower', 'Azure Beachfront', 'Emerald Heights', 'Pinnacle Business Park'],
        datasets: [{
            label: 'Revenue (Crores ₹)',
            data: [2.8, 4.2, 12.8, 4.5, 7.2],
            backgroundColor: '#6a5acd',
            borderRadius: 5,
            barThickness: isMobile ? 18 : 30, // Thinner bars on mobile
            maxBarThickness: 30
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            barPercentage: isMobile ? 0.6 : 0.9, // Add space between bars on mobile
            categoryPercentage: isMobile ? 0.7 : 0.9, // Add more space between categories on mobile
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#252535',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value + 'Cr';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Revenue: ₹${context.parsed.y}Cr`;
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

/**
 * Line Chart for Portfolio Performance (Investor Dashboard)
 */
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(106, 90, 205, 0.4)');
    gradient.addColorStop(1, 'rgba(106, 90, 205, 0)');
    
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
            label: 'Portfolio Value',
            data: [4.2, 4.3, 4.25, 4.4, 4.5, 4.55, 4.7, 4.8, 4.85],
            borderColor: '#6a5acd',
            backgroundColor: gradient,
            tension: 0.3,
            fill: true
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '₹' + value + 'Cr';
                        }
                    },
                    grid: {
                        color: '#252535',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Value: ₹${context.parsed.y}Cr`;
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

/**
 * Pie Chart for Portfolio Allocation (Investor Dashboard)
 */
function createAllocationChart() {
    const ctx = document.getElementById('allocationChart').getContext('2d');
    
    const data = {
        labels: ['Luxury Villas', 'Apartments', 'Commercial', 'Vacation Homes', 'Land'],
        datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
                '#2196f3',
                '#4caf50',
                '#9c27b0',
                '#ff9800',
                '#f44336'
            ],
            borderWidth: 0
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        boxWidth: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

/**
 * Bar Chart for Monthly Rental Income (Investor Dashboard)
 */
function createIncomeChart() {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;
    
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
            label: 'Monthly Income',
            data: [28500, 29200, 30100, 30800, 31200, 31500, 32000, 32200, 32450],
            backgroundColor: '#6a5acd',
            borderRadius: 5,
            barThickness: isMobile ? 18 : 30, // Thinner bars on mobile
            maxBarThickness: 30
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            barPercentage: isMobile ? 0.6 : 0.9, // Add space between bars on mobile
            categoryPercentage: isMobile ? 0.7 : 0.9, // Add more space between categories on mobile
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#252535',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Income: ₹${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

/**
 * Initialize Dropdown Menus
 */
function initDropdowns() {
    const dropdownToggle = document.querySelector('.header-user');
    
    if (dropdownToggle) {
        // Create dropdown menu if it doesn't exist
        if (!document.querySelector('.user-dropdown')) {
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.innerHTML = `
                <ul>
                    <li><a href="#"><i class="fas fa-user"></i> Profile</a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                    <li><a href="#"><i class="fas fa-bell"></i> Notifications</a></li>
                    <li><a href="../../index.html"><i class="fas fa-home"></i> Back to Website</a></li>
                    <li class="divider"></li>
                    <li><a href="#" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            `;
            
            document.body.appendChild(dropdown);
            
            // Add dropdown styles
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                .user-dropdown {
                    position: absolute;
                    top: 70px;
                    right: 1.5rem;
                    background-color: #1e1e2d;
                    border: 1px solid #252535;
                    border-radius: 10px;
                    width: 220px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    z-index: 100;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                
                .user-dropdown.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .user-dropdown ul {
                    padding: 0.5rem 0;
                }
                
                .user-dropdown li {
                    padding: 0;
                }
                
                .user-dropdown li a {
                    padding: 0.8rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    color: var(--color-text-secondary);
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }
                
                .user-dropdown li a:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                    color: var(--color-text-primary);
                }
                
                .user-dropdown li.divider {
                    height: 1px;
                    background-color: #252535;
                    margin: 0.5rem 0;
                }
                
                .user-dropdown li a.logout {
                    color: #f44336;
                }
                
                .user-dropdown li a.logout:hover {
                    background-color: rgba(244, 67, 54, 0.1);
                }
            `;
            document.head.appendChild(styleSheet);
            
            // Toggle dropdown
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.querySelector('.user-dropdown');
                dropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                const dropdown = document.querySelector('.user-dropdown');
                dropdown.classList.remove('active');
            });
        }
    }
}

/**
 * Initialize Notification System
 */
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const messageBtn = document.querySelector('.message-btn');
    
    if (notificationBtn) {
        // Create notifications panel if it doesn't exist
        if (!document.querySelector('.notifications-panel')) {
            const panel = document.createElement('div');
            panel.className = 'notifications-panel';
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>Notifications</h3>
                    <button class="btn-text">Mark all as read</button>
                </div>
                <div class="panel-body">
                    <div class="notification unread">
                        <div class="notification-icon blue">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="notification-content">
                            <p class="notification-text">Your portfolio value increased by 3.2% this month.</p>
                            <p class="notification-time">2 hours ago</p>
                        </div>
                        <button class="notification-action"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                    <div class="notification unread">
                        <div class="notification-icon green">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="notification-content">
                            <p class="notification-text">Azure Beachfront project has been completed.</p>
                            <p class="notification-time">5 hours ago</p>
                        </div>
                        <button class="notification-action"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                    <div class="notification">
                        <div class="notification-icon orange">
                            <i class="fas fa-bell"></i>
                        </div>
                        <div class="notification-content">
                            <p class="notification-text">New investment opportunity available in London.</p>
                            <p class="notification-time">Yesterday</p>
                        </div>
                        <button class="notification-action"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </div>
                <div class="panel-footer">
                    <a href="#">View all notifications</a>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // Add notifications panel styles
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                .notifications-panel {
                    position: absolute;
                    top: 70px;
                    right: 1.5rem;
                    background-color: #1e1e2d;
                    border: 1px solid #252535;
                    border-radius: 10px;
                    width: 350px;
                    max-width: calc(100vw - 3rem);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    z-index: 100;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                
                .notifications-panel.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .panel-header {
                    padding: 1rem 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #252535;
                }
                
                .panel-header h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .panel-body {
                    max-height: 350px;
                    overflow-y: auto;
                }
                
                .notification {
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    border-bottom: 1px solid #252535;
                    transition: background-color 0.2s ease;
                }
                
                .notification:hover {
                    background-color: rgba(255, 255, 255, 0.02);
                }
                
                .notification.unread {
                    background-color: rgba(106, 90, 205, 0.05);
                }
                
                .notification-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }
                
                .notification-icon.blue {
                    background-color: rgba(33, 150, 243, 0.1);
                    color: #2196f3;
                }
                
                .notification-icon.green {
                    background-color: rgba(76, 175, 80, 0.1);
                    color: #4caf50;
                }
                
                .notification-icon.orange {
                    background-color: rgba(255, 152, 0, 0.1);
                    color: #ff9800;
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-text {
                    font-size: 0.9rem;
                    margin-bottom: 0.3rem;
                }
                
                .notification-time {
                    font-size: 0.8rem;
                    color: var(--color-text-tertiary);
                    margin: 0;
                }
                
                .notification-action {
                    background: none;
                    border: none;
                    color: var(--color-text-tertiary);
                    font-size: 0.9rem;
                    cursor: pointer;
                    padding: 0.3rem;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .notification-action:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: var(--color-text-primary);
                }
                
                .panel-footer {
                    padding: 1rem 1.5rem;
                    text-align: center;
                    border-top: 1px solid #252535;
                }
                
                .panel-footer a {
                    color: var(--color-primary);
                    font-size: 0.9rem;
                }
            `;
            document.head.appendChild(styleSheet);
            
            // Toggle notifications panel
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const panel = document.querySelector('.notifications-panel');
                panel.classList.toggle('active');
                
                // Close messages panel if open
                const messagesPanel = document.querySelector('.messages-panel');
                if (messagesPanel) {
                    messagesPanel.classList.remove('active');
                }
            });
            
            // Close panel when clicking outside
            document.addEventListener('click', () => {
                const panel = document.querySelector('.notifications-panel');
                panel.classList.remove('active');
            });
            
            panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    if (messageBtn) {
        // Create messages panel if it doesn't exist
        if (!document.querySelector('.messages-panel')) {
            const panel = document.createElement('div');
            panel.className = 'messages-panel';
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>Messages</h3>
                    <button class="btn-text">Mark all as read</button>
                </div>
                <div class="panel-body">
                    <div class="message unread">
                        <div class="message-avatar">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User">
                            <span class="status-dot online"></span>
                        </div>
                        <div class="message-content">
                            <div class="message-header">
                                <h4>Robert Chen</h4>
                                <span class="message-time">10:45 AM</span>
                            </div>
                            <p class="message-text">I'm interested in the Skyline Residences project. Can we discuss the investment details?</p>
                        </div>
                    </div>
                    <div class="message unread">
                        <div class="message-avatar">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User">
                            <span class="status-dot online"></span>
                        </div>
                        <div class="message-content">
                            <div class="message-header">
                                <h4>Sarah Johnson</h4>
                                <span class="message-time">Yesterday</span>
                            </div>
                            <p class="message-text">Thank you for the portfolio update. The returns are looking great!</p>
                        </div>
                    </div>
                    <div class="message">
                        <div class="message-avatar">
                            <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="User">
                            <span class="status-dot away"></span>
                        </div>
                        <div class="message-content">
                            <div class="message-header">
                                <h4>Vikram Mehta</h4>
                                <span class="message-time">2 days ago</span>
                            </div>
                            <p class="message-text">Let's schedule a meeting to discuss the new development opportunities in Dubai.</p>
                        </div>
                    </div>
                </div>
                <div class="panel-footer">
                    <a href="#">View all messages</a>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // Add messages panel styles
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                .messages-panel {
                    position: absolute;
                    top: 70px;
                    right: 1.5rem;
                    background-color: #1e1e2d;
                    border: 1px solid #252535;
                    border-radius: 10px;
                    width: 350px;
                    max-width: calc(100vw - 3rem);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    z-index: 100;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                
                .messages-panel.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .message {
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    border-bottom: 1px solid #252535;
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }
                
                .message:hover {
                    background-color: rgba(255, 255, 255, 0.02);
                }
                
                .message.unread {
                    background-color: rgba(106, 90, 205, 0.05);
                }
                
                .message-avatar {
                    position: relative;
                    flex-shrink: 0;
                }
                
                .message-avatar img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .status-dot {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 2px solid #1e1e2d;
                }
                
                .status-dot.online {
                    background-color: #4caf50;
                }
                
                .status-dot.away {
                    background-color: #ff9800;
                }
                
                .status-dot.offline {
                    background-color: #9e9e9e;
                }
                
                .message-content {
                    flex: 1;
                }
                
                .message-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.3rem;
                }
                
                .message-header h4 {
                    font-size: 0.95rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .message-time {
                    font-size: 0.8rem;
                    color: var(--color-text-tertiary);
                }
                
                .message-text {
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `;
            document.head.appendChild(styleSheet);
            
            // Toggle messages panel
            messageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const panel = document.querySelector('.messages-panel');
                panel.classList.toggle('active');
                
                // Close notifications panel if open
                const notificationsPanel = document.querySelector('.notifications-panel');
                if (notificationsPanel) {
                    notificationsPanel.classList.remove('active');
                }
            });
            
            // Close panel when clicking outside
            document.addEventListener('click', () => {
                const panel = document.querySelector('.messages-panel');
                panel.classList.remove('active');
            });
            
            panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
}
