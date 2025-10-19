// Admin Panel JavaScript

// ADMIN WHITELIST - Add authorized admin emails here
const ADMIN_WHITELIST = [
    'admin@buildreigngaming.com',
    'itsprestonjacobs@gmail.com',
    'support@buildreigngaming.com',
    'manager@buildreigngaming.com',
    'j3team@admin.com'
];

// Current ticket being viewed/edited
let currentEditTicket = null;
let ticketToDelete = null;

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('admin')) return;

    displayWhitelist();
    checkAdminAuth();
    initializeAdminLogin();
});

// Display whitelist on login screen
function displayWhitelist() {
    const whitelistDisplay = document.getElementById('whitelistDisplay');
    if (whitelistDisplay) {
        whitelistDisplay.innerHTML = ADMIN_WHITELIST.map(email =>
            `<li>${email}</li>`
        ).join('');
    }
}

// Check if user is authenticated admin
function checkAdminAuth() {
    const adminUser = getAdminUser();
    const loginScreen = document.getElementById('adminLoginScreen');
    const dashboard = document.getElementById('adminDashboard');

    if (adminUser && isAdminWhitelisted(adminUser.email)) {
        // Admin is logged in and whitelisted
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        updateAdminUI(adminUser);
        loadAdminDashboard();
    } else {
        // Not logged in or not authorized
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
        localStorage.removeItem('adminUser');
    }
}

// Get admin user from localStorage
function getAdminUser() {
    const adminStr = localStorage.getItem('adminUser');
    return adminStr ? JSON.parse(adminStr) : null;
}

// Check if email is in whitelist
function isAdminWhitelisted(email) {
    return ADMIN_WHITELIST.includes(email.toLowerCase());
}

// Initialize admin login form
function initializeAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value.toLowerCase();
    const password = document.getElementById('adminPassword').value;

    // Check if email is whitelisted
    if (!isAdminWhitelisted(email)) {
        alert('⛔ Access Denied: Your email is not authorized for admin access.\n\nOnly whitelisted administrators can access this panel.');
        return;
    }

    // Demo: Accept any password for whitelisted emails
    const adminUser = {
        email: email,
        name: email.split('@')[0],
        role: 'Administrator',
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    checkAdminAuth();
}

// Handle admin logout
function handleAdminLogout() {
    localStorage.removeItem('adminUser');
    window.location.reload();
}

// Update admin UI
function updateAdminUI(adminUser) {
    const greeting = document.getElementById('adminGreeting');
    const logoutBtn = document.getElementById('adminLogoutBtn');

    if (greeting) {
        greeting.textContent = `${adminUser.role}: ${adminUser.email}`;
    }
    if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
    }
}

// Load admin dashboard
function loadAdminDashboard() {
    loadAdminStats();
    loadAdminTickets();
    initializeAdminFilters();
}

// Load admin statistics
function loadAdminStats() {
    const tickets = getTickets();

    document.getElementById('adminTotalTickets').textContent = tickets.length;
    document.getElementById('adminOpenTickets').textContent =
        tickets.filter(t => t.status === 'open').length;
    document.getElementById('adminProgressTickets').textContent =
        tickets.filter(t => t.status === 'in-progress').length;
    document.getElementById('adminPendingTickets').textContent =
        tickets.filter(t => t.status === 'awaiting-reply').length;
    document.getElementById('adminClosedTickets').textContent =
        tickets.filter(t => t.status === 'closed').length;
    document.getElementById('adminCriticalTickets').textContent =
        tickets.filter(t => t.priority === 'critical').length;
}

// Initialize admin filters
function initializeAdminFilters() {
    const statusFilter = document.getElementById('adminStatusFilter');
    const priorityFilter = document.getElementById('adminPriorityFilter');
    const departmentFilter = document.getElementById('adminDepartmentFilter');
    const searchInput = document.getElementById('adminSearch');

    if (statusFilter) {
        statusFilter.addEventListener('change', loadAdminTickets);
    }
    if (priorityFilter) {
        priorityFilter.addEventListener('change', loadAdminTickets);
    }
    if (departmentFilter) {
        departmentFilter.addEventListener('change', loadAdminTickets);
    }
    if (searchInput) {
        searchInput.addEventListener('input', loadAdminTickets);
    }
}

// Load and display admin tickets
function loadAdminTickets() {
    let tickets = getTickets();

    // Apply filters
    const statusFilter = document.getElementById('adminStatusFilter').value;
    const priorityFilter = document.getElementById('adminPriorityFilter').value;
    const departmentFilter = document.getElementById('adminDepartmentFilter').value;
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();

    if (statusFilter !== 'all') {
        tickets = tickets.filter(t => t.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
        tickets = tickets.filter(t => t.priority === priorityFilter);
    }
    if (departmentFilter !== 'all') {
        tickets = tickets.filter(t => t.department === departmentFilter);
    }
    if (searchTerm) {
        tickets = tickets.filter(t =>
            t.id.toLowerCase().includes(searchTerm) ||
            t.fullName.toLowerCase().includes(searchTerm) ||
            t.email.toLowerCase().includes(searchTerm) ||
            t.subject.toLowerCase().includes(searchTerm)
        );
    }

    displayAdminTickets(tickets);
}

// Display tickets in admin table
function displayAdminTickets(tickets) {
    const tbody = document.getElementById('adminTicketsBody');

    if (tickets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-tickets">
                    <div class="empty-tickets-icon">📭</div>
                    <h3>No Tickets Found</h3>
                    <p>No support tickets match your current filters.</p>
                </td>
            </tr>
        `;
        return;
    }

    // Sort by date (newest first)
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = tickets.map(ticket => `
        <tr>
            <td class="ticket-id-cell">${ticket.id}</td>
            <td class="customer-cell">
                <div>${ticket.fullName}</div>
                <small style="color: var(--text-secondary);">${ticket.email}</small>
            </td>
            <td class="subject-cell" title="${ticket.subject}">${ticket.subject}</td>
            <td>
                <span style="font-size: 0.85rem;">${formatDepartment(ticket.department)}</span>
            </td>
            <td>
                <span class="priority-badge ${ticket.priority}">${formatPriority(ticket.priority)}</span>
            </td>
            <td>
                <span class="status-badge ${ticket.status}">${formatStatus(ticket.status)}</span>
            </td>
            <td style="font-size: 0.85rem;">${formatDate(ticket.createdAt)}</td>
            <td style="font-size: 0.85rem;">${formatDate(ticket.updatedAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-only" onclick="viewAdminTicket('${ticket.id}')" title="View & Reply">👁️</button>
                    <button class="btn-icon-only delete" onclick="deleteTicket('${ticket.id}')" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// View ticket in admin modal
function viewAdminTicket(ticketId) {
    const tickets = getTickets();
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) return;

    currentEditTicket = ticket;

    // Populate modal
    document.getElementById('adminModalTicketNumber').textContent = ticket.id;
    document.getElementById('adminModalSubject').textContent = ticket.subject;
    document.getElementById('adminModalStatus').value = ticket.status;
    document.getElementById('adminModalCustomerName').textContent = ticket.fullName;
    document.getElementById('adminModalCustomerEmail').textContent = ticket.email;
    document.getElementById('adminModalOrderNumber').textContent = ticket.orderNumber || 'N/A';
    document.getElementById('adminModalDepartment').textContent = formatDepartment(ticket.department);
    document.getElementById('adminModalPriority').textContent = formatPriority(ticket.priority);
    document.getElementById('adminModalCreated').textContent = formatDate(ticket.createdAt);
    document.getElementById('adminModalUpdated').textContent = formatDate(ticket.updatedAt);

    // Load messages
    displayAdminTicketMessages(ticket);

    // Show modal
    document.getElementById('adminTicketModal').style.display = 'block';

    // Set up reply form
    const replyForm = document.getElementById('adminReplyForm');
    replyForm.onsubmit = (e) => handleAdminReply(e, ticket.id);

    // Close button
    const closeBtn = document.querySelector('#adminTicketModal .modal-close');
    closeBtn.onclick = closeAdminTicketModal;
}

// Display messages in admin modal
function displayAdminTicketMessages(ticket) {
    const messagesContainer = document.getElementById('adminTicketMessages');

    messagesContainer.innerHTML = ticket.messages.map(msg => `
        <div class="message-item ${msg.isStaff ? 'staff-reply' : ''}">
            <div class="message-header">
                <span class="message-author ${msg.isStaff ? 'staff' : ''}">${msg.author}${msg.isStaff ? ' (Staff)' : ''}</span>
                <span class="message-date">${formatDate(msg.date)}</span>
            </div>
            <div class="message-content">${msg.content}</div>
        </div>
    `).join('');
}

// Handle admin reply
function handleAdminReply(e, ticketId) {
    e.preventDefault();

    const replyMessage = document.getElementById('adminReplyMessage').value;
    if (!replyMessage.trim()) {
        alert('Please enter a reply message.');
        return;
    }

    const adminUser = getAdminUser();
    const tickets = getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex !== -1) {
        // Add staff reply
        tickets[ticketIndex].messages.push({
            author: `${adminUser.name} (Support Team)`,
            content: replyMessage,
            date: new Date().toISOString(),
            isStaff: true
        });

        // Update ticket
        tickets[ticketIndex].updatedAt = new Date().toISOString();
        tickets[ticketIndex].status = 'in-progress';

        localStorage.setItem('supportTickets', JSON.stringify(tickets));

        // Refresh display
        displayAdminTicketMessages(tickets[ticketIndex]);
        document.getElementById('adminReplyMessage').value = '';
        document.getElementById('adminModalStatus').value = 'in-progress';

        alert('✅ Reply sent successfully!');

        // Refresh dashboard
        loadAdminStats();
        loadAdminTickets();
    }
}

// Update ticket status
function updateTicketStatus() {
    if (!currentEditTicket) return;

    const newStatus = document.getElementById('adminModalStatus').value;
    const tickets = getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === currentEditTicket.id);

    if (ticketIndex !== -1) {
        tickets[ticketIndex].status = newStatus;
        tickets[ticketIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('supportTickets', JSON.stringify(tickets));

        alert(`✅ Ticket status updated to: ${formatStatus(newStatus)}`);

        // Refresh
        loadAdminStats();
        loadAdminTickets();
        currentEditTicket.status = newStatus;
    }
}

// Delete ticket
function deleteTicket(ticketId) {
    ticketToDelete = ticketId;
    document.getElementById('deleteTicketId').textContent = ticketId;
    document.getElementById('deleteModal').style.display = 'block';

    // Close button
    const closeBtn = document.querySelector('#deleteModal .modal-close');
    closeBtn.onclick = () => closeModal('deleteModal');
}

// Confirm delete
function confirmDelete() {
    if (!ticketToDelete) return;

    const tickets = getTickets();
    const filteredTickets = tickets.filter(t => t.id !== ticketToDelete);
    localStorage.setItem('supportTickets', JSON.stringify(filteredTickets));

    closeModal('deleteModal');
    loadAdminStats();
    loadAdminTickets();

    alert('✅ Ticket deleted successfully!');
    ticketToDelete = null;
}

// Close admin ticket modal
function closeAdminTicketModal() {
    document.getElementById('adminTicketModal').style.display = 'none';
    currentEditTicket = null;
}

// Refresh admin tickets
function refreshAdminTickets() {
    loadAdminStats();
    loadAdminTickets();
    alert('✅ Dashboard refreshed!');
}

// Create demo tickets for testing
function createAdminDemoTickets() {
    const demoTickets = [
        {
            id: 'BR100001',
            fullName: 'John Gamer',
            email: 'john@example.com',
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
                    author: 'John Gamer',
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
        },
        {
            id: 'BR100002',
            fullName: 'Sarah Pro',
            email: 'sarah@example.com',
            department: 'shipping',
            priority: 'medium',
            orderNumber: 'BR-2025-12346',
            subject: 'When will my desk be delivered?',
            message: 'I ordered the Command Center Pro desk 5 days ago. When can I expect delivery?',
            status: 'open',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            messages: [
                {
                    author: 'Sarah Pro',
                    content: 'I ordered the Command Center Pro desk 5 days ago. When can I expect delivery?',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    isStaff: false
                }
            ]
        },
        {
            id: 'BR100003',
            fullName: 'Mike Streamer',
            email: 'mike@example.com',
            department: 'warranty',
            priority: 'critical',
            orderNumber: 'BR-2025-11200',
            subject: 'Hydraulic lift not working on chair',
            message: 'The hydraulic lift on my Titan X chair stopped working after 3 months. The chair won\'t stay up. This is urgent as I stream 8 hours a day!',
            status: 'awaiting-reply',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
            messages: [
                {
                    author: 'Mike Streamer',
                    content: 'The hydraulic lift on my Titan X chair stopped working after 3 months. The chair won\'t stay up. This is urgent as I stream 8 hours a day!',
                    date: new Date(Date.now() - 7200000).toISOString(),
                    isStaff: false
                },
                {
                    author: 'Support Team',
                    content: 'We apologize for the inconvenience! This is covered under warranty. We\'re processing a replacement hydraulic cylinder for you. You\'ll receive a tracking number within 24 hours.',
                    date: new Date(Date.now() - 3600000).toISOString(),
                    isStaff: true
                },
                {
                    author: 'Mike Streamer',
                    content: 'Thank you! How long will shipping take?',
                    date: new Date(Date.now() - 1800000).toISOString(),
                    isStaff: false
                }
            ]
        },
        {
            id: 'BR100004',
            fullName: 'Lisa Chen',
            email: 'lisa@example.com',
            department: 'sales',
            priority: 'low',
            orderNumber: '',
            subject: 'Question about chair weight capacity',
            message: 'What is the weight capacity of the BuildReign Apex Series chair?',
            status: 'closed',
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
            updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
            messages: [
                {
                    author: 'Lisa Chen',
                    content: 'What is the weight capacity of the BuildReign Apex Series chair?',
                    date: new Date(Date.now() - 86400000 * 7).toISOString(),
                    isStaff: false
                },
                {
                    author: 'Support Team',
                    content: 'The BuildReign Apex Series has a weight capacity of 300 lbs (136 kg). It features a heavy-duty steel frame and reinforced base for maximum durability.',
                    date: new Date(Date.now() - 86400000 * 6).toISOString(),
                    isStaff: true
                },
                {
                    author: 'Lisa Chen',
                    content: 'Perfect, thank you!',
                    date: new Date(Date.now() - 86400000 * 6).toISOString(),
                    isStaff: false
                }
            ]
        },
        {
            id: 'BR100005',
            fullName: 'David Martinez',
            email: 'david@example.com',
            department: 'returns',
            priority: 'medium',
            orderNumber: 'BR-2025-12300',
            subject: 'Want to exchange chair color',
            message: 'I received the black Apex Series but I actually wanted the red one. Can I exchange it?',
            status: 'open',
            createdAt: new Date(Date.now() - 43200000).toISOString(),
            updatedAt: new Date(Date.now() - 43200000).toISOString(),
            messages: [
                {
                    author: 'David Martinez',
                    content: 'I received the black Apex Series but I actually wanted the red one. Can I exchange it?',
                    date: new Date(Date.now() - 43200000).toISOString(),
                    isStaff: false
                }
            ]
        }
    ];

    localStorage.setItem('supportTickets', JSON.stringify(demoTickets));
    console.log('✅ Demo tickets created!');

    if (window.location.pathname.includes('admin')) {
        loadAdminDashboard();
    }
}

// Console welcome
console.log('%c BuildReign Admin Panel ',
    'background: linear-gradient(135deg, #ff0088 0%, #0088ff 100%); color: #fff; font-size: 16px; font-weight: bold; padding: 8px;'
);
console.log('Admin whitelist:', ADMIN_WHITELIST);
console.log('Use createAdminDemoTickets() to populate with sample tickets.');
