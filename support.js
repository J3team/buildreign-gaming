// Support Ticket System JavaScript

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeModals();
    initializeTicketForm();
    initializePortal();
});

// Authentication System
function initializeAuth() {
    const currentUser = getCurrentUser();
    updateUserUI(currentUser);

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Portal login button
    const portalLoginBtn = document.getElementById('portalLoginBtn');
    if (portalLoginBtn) {
        portalLoginBtn.addEventListener('click', showLoginModal);
    }

    // Login button in navbar
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function updateUserUI(user) {
    const userGreeting = document.getElementById('userGreeting');
    const logoutBtn = document.getElementById('logoutBtn');
    const portalLoginBtn = document.getElementById('portalLoginBtn');
    const loginBtn = document.getElementById('loginBtn');

    if (user) {
        if (userGreeting) userGreeting.textContent = `Welcome, ${user.name}`;
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (portalLoginBtn) portalLoginBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        if (userGreeting) userGreeting.textContent = '';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (portalLoginBtn) portalLoginBtn.style.display = 'inline-block';
        if (loginBtn) loginBtn.style.display = 'inline-block';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Demo login - accept any email/password
    const user = {
        name: email.split('@')[0],
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserUI(user);
    closeModal('loginModal');

    // Refresh portal if on portal page
    if (window.location.pathname.includes('portal')) {
        location.reload();
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const user = {
        name: name,
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserUI(user);
    closeModal('registerModal');

    alert('Account created successfully!');
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    updateUserUI(null);

    // Redirect to home if on portal page
    if (window.location.pathname.includes('portal')) {
        window.location.href = 'index.html';
    }
}

// Modal Management
function initializeModals() {
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegisterModal() {
    closeModal('loginModal');
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeSuccessModal() {
    closeModal('successModal');
    document.getElementById('ticketForm').reset();
}

function closeTicketModal() {
    closeModal('ticketModal');
}

// Ticket Form
function initializeTicketForm() {
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleTicketSubmit);
    }
}

async function handleTicketSubmit(e) {
    e.preventDefault();

    const user = getCurrentUser();

    // Get form data
    const formData = {
        id: generateTicketId(),
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        priority: document.getElementById('priority').value,
        orderNumber: document.getElementById('orderNumber').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
            {
                author: document.getElementById('fullName').value,
                content: document.getElementById('message').value,
                date: new Date().toISOString(),
                isStaff: false
            }
        ]
    };

    // Save ticket (Firebase or localStorage)
    await saveTicket(formData);

    // Show success modal
    document.getElementById('ticketNumber').textContent = formData.id;
    document.getElementById('successModal').style.display = 'block';

    // Reset form
    e.target.reset();
}

function generateTicketId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BR${timestamp.toString().slice(-6)}${random}`;
}

// Note: saveTicket, getTickets, getUserTickets are now in firebase-db.js

// Portal Page
function initializePortal() {
    if (!window.location.pathname.includes('portal')) return;

    const user = getCurrentUser();
    const loginRequired = document.getElementById('portalLoginRequired');
    const dashboard = document.getElementById('portalDashboard');

    if (user) {
        // User is logged in - show dashboard
        loginRequired.style.display = 'none';
        dashboard.style.display = 'block';
        loadUserTickets(user.email);

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                loadUserTickets(user.email, this.value);
            });
        }
    } else {
        // User not logged in - show login prompt
        loginRequired.style.display = 'flex';
        dashboard.style.display = 'none';
    }
}

async function loadUserTickets(userEmail, statusFilter = 'all') {
    const tickets = await getUserTickets(userEmail);

    // Filter by status
    const filteredTickets = statusFilter === 'all'
        ? tickets
        : tickets.filter(t => t.status === statusFilter);

    // Update stats
    updateTicketStats(tickets);

    // Display tickets
    displayTickets(filteredTickets);
}

function updateTicketStats(tickets) {
    document.getElementById('totalTickets').textContent = tickets.length;
    document.getElementById('openTickets').textContent =
        tickets.filter(t => t.status === 'open').length;
    document.getElementById('pendingTickets').textContent =
        tickets.filter(t => t.status === 'awaiting-reply').length;
    document.getElementById('closedTickets').textContent =
        tickets.filter(t => t.status === 'closed').length;
}

function displayTickets(tickets) {
    const ticketsList = document.getElementById('ticketsList');

    if (tickets.length === 0) {
        ticketsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No Tickets Found</h3>
                <p>You haven't submitted any support tickets yet.</p>
                <a href="support.html" class="btn btn-primary" style="margin-top: 1rem;">Submit a Ticket</a>
            </div>
        `;
        return;
    }

    ticketsList.innerHTML = tickets.map(ticket => `
        <div class="ticket-item" onclick="viewTicket('${ticket.id}')">
            <div class="ticket-item-header">
                <div class="ticket-item-title">
                    <h3>Ticket #${ticket.id}</h3>
                    <p>${ticket.subject}</p>
                </div>
                <span class="status-badge ${ticket.status}">${formatStatus(ticket.status)}</span>
            </div>
            <div class="ticket-item-meta">
                <span>📁 ${formatDepartment(ticket.department)}</span>
                <span>⚡ ${formatPriority(ticket.priority)}</span>
                <span>📅 ${formatDate(ticket.createdAt)}</span>
                <span>💬 ${ticket.messages.length} ${ticket.messages.length === 1 ? 'reply' : 'replies'}</span>
            </div>
        </div>
    `).join('');
}

async function viewTicket(ticketId) {
    const ticket = await getTicketById(ticketId);

    if (!ticket) return;

    // Populate modal
    document.getElementById('modalTicketNumber').textContent = ticket.id;
    document.getElementById('modalSubject').textContent = ticket.subject;
    document.getElementById('modalStatus').textContent = formatStatus(ticket.status);
    document.getElementById('modalStatus').className = `status-badge ${ticket.status}`;
    document.getElementById('modalDepartment').textContent = formatDepartment(ticket.department);
    document.getElementById('modalPriority').textContent = formatPriority(ticket.priority);
    document.getElementById('modalCreated').textContent = formatDate(ticket.createdAt);
    document.getElementById('modalUpdated').textContent = formatDate(ticket.updatedAt);

    // Load messages
    displayTicketMessages(ticket);

    // Show modal
    document.getElementById('ticketModal').style.display = 'block';

    // Set up reply form
    const replyForm = document.getElementById('replyForm');
    replyForm.onsubmit = (e) => handleReply(e, ticket.id);
}

function displayTicketMessages(ticket) {
    const messagesContainer = document.getElementById('ticketMessages');

    messagesContainer.innerHTML = ticket.messages.map(msg => `
        <div class="message-item ${msg.isStaff ? 'staff-reply' : ''}">
            <div class="message-header">
                <span class="message-author ${msg.isStaff ? 'staff' : ''}">${msg.author}</span>
                <span class="message-date">${formatDate(msg.date)}</span>
            </div>
            <div class="message-content">${msg.content}</div>
        </div>
    `).join('');
}

async function handleReply(e, ticketId) {
    e.preventDefault();

    const replyMessage = document.getElementById('replyMessage').value;
    if (!replyMessage.trim()) return;

    const user = getCurrentUser();

    // Get ticket
    const ticket = await getTicketById(ticketId);

    if (ticket) {
        // Add reply to ticket
        ticket.messages.push({
            author: user.name,
            content: replyMessage,
            date: new Date().toISOString(),
            isStaff: false
        });
        ticket.updatedAt = new Date().toISOString();
        ticket.status = 'awaiting-reply';

        // Update in database
        await updateTicket(ticketId, ticket);

        // Simulate staff reply after 2 seconds
        setTimeout(() => {
            addStaffReply(ticketId);
        }, 2000);

        // Refresh display
        displayTicketMessages(ticket);
        document.getElementById('replyMessage').value = '';

        alert('Reply sent! Our support team will respond shortly.');
    }
}

async function addStaffReply(ticketId) {
    const ticket = await getTicketById(ticketId);

    if (ticket) {
        const responses = [
            "Thank you for your message. Our team is reviewing your request and will provide a detailed response soon.",
            "We've received your update. A specialist from our team will assist you within the next few hours.",
            "Thanks for the additional information. We're working on resolving this issue for you.",
            "Your request has been escalated to our senior support team. We'll update you shortly."
        ];

        ticket.messages.push({
            author: 'Support Team',
            content: responses[Math.floor(Math.random() * responses.length)],
            date: new Date().toISOString(),
            isStaff: true
        });
        ticket.status = 'in-progress';
        ticket.updatedAt = new Date().toISOString();

        await updateTicket(ticketId, ticket);
    }
}

// Utility Functions
function formatStatus(status) {
    const statusMap = {
        'open': 'Open',
        'in-progress': 'In Progress',
        'awaiting-reply': 'Awaiting Reply',
        'closed': 'Closed'
    };
    return statusMap[status] || status;
}

function formatDepartment(dept) {
    const deptMap = {
        'sales': 'Sales',
        'technical': 'Technical Support',
        'shipping': 'Shipping & Delivery',
        'returns': 'Returns & Refunds',
        'warranty': 'Warranty Claims',
        'billing': 'Billing & Payments',
        'general': 'General Inquiry'
    };
    return deptMap[dept] || dept;
}

function formatPriority(priority) {
    const priorityMap = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'critical': 'Critical'
    };
    return priorityMap[priority] || priority;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Demo: Create sample tickets for testing
function createDemoTickets() {
    const demoTickets = [
        {
            id: 'BR100001',
            fullName: 'Demo User',
            email: 'demo@example.com',
            department: 'technical',
            priority: 'high',
            orderNumber: 'BR-2025-12345',
            subject: 'Chair armrest loose after assembly',
            message: 'I just assembled my BuildReign Pro Elite chair, but the right armrest seems loose. Can you help?',
            status: 'in-progress',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
            messages: [
                {
                    author: 'Demo User',
                    content: 'I just assembled my BuildReign Pro Elite chair, but the right armrest seems loose. Can you help?',
                    date: new Date(Date.now() - 86400000 * 2).toISOString(),
                    isStaff: false
                },
                {
                    author: 'Support Team',
                    content: 'Thank you for contacting us! Please check if the armrest adjustment screws are fully tightened. They are located underneath the armrest. Let us know if this helps!',
                    date: new Date(Date.now() - 3600000).toISOString(),
                    isStaff: true
                }
            ]
        }
    ];

    localStorage.setItem('supportTickets', JSON.stringify(demoTickets));
}

// Console welcome
console.log('%c BuildReign Support System ',
    'background: linear-gradient(135deg, #00ff88 0%, #0088ff 100%); color: #0a0a0f; font-size: 16px; font-weight: bold; padding: 8px;'
);
console.log('Support ticket system initialized. Use createDemoTickets() to add sample data.');
