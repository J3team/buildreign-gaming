// Discord Webhook Integration for Support Tickets
// Configure your Discord webhook URL below

// ============= CONFIGURATION =============
// To set up Discord webhook:
// 1. Go to your Discord server settings
// 2. Navigate to Integrations > Webhooks
// 3. Click "New Webhook"
// 4. Name it "BuildReign Support"
// 5. Copy the webhook URL and paste it below

const DISCORD_WEBHOOK_URL = ''; // Paste your Discord webhook URL here

// ============= DISCORD FUNCTIONS =============

async function sendDiscordNotification(ticket, type = 'new') {
    // Skip if webhook URL is not configured
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === '') {
        console.log('⚠️ Discord webhook not configured. Skipping notification.');
        return false;
    }

    try {
        const embed = createTicketEmbed(ticket, type);
        const payload = {
            username: 'BuildReign Support',
            avatar_url: 'https://via.placeholder.com/128/00ff88/1a1a2e?text=BR',
            embeds: [embed]
        };

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ Discord notification sent successfully');
            return true;
        } else {
            console.error('❌ Discord webhook error:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('❌ Discord notification error:', error);
        return false;
    }
}

function createTicketEmbed(ticket, type) {
    const colors = {
        'new': 65280,        // Green (#00ff00)
        'reply': 255,        // Blue (#0000ff)
        'update': 16776960,  // Yellow (#ffff00)
        'closed': 8421504    // Gray (#808080)
    };

    const priorityEmojis = {
        'low': '🟢',
        'medium': '🟡',
        'high': '🟠',
        'critical': '🔴'
    };

    const departmentEmojis = {
        'sales': '💰',
        'technical': '🔧',
        'shipping': '📦',
        'returns': '↩️',
        'warranty': '🛡️',
        'billing': '💳',
        'general': '💬'
    };

    let title = '';
    let description = '';

    switch (type) {
        case 'new':
            title = '🎫 New Support Ticket';
            description = 'A new support ticket has been submitted.';
            break;
        case 'reply':
            title = '💬 Ticket Reply';
            description = 'A customer has replied to their ticket.';
            break;
        case 'update':
            title = '🔄 Ticket Updated';
            description = 'A ticket has been updated.';
            break;
        case 'closed':
            title = '✅ Ticket Closed';
            description = 'A ticket has been closed.';
            break;
    }

    const embed = {
        title: title,
        description: description,
        color: colors[type] || colors['new'],
        fields: [
            {
                name: '🆔 Ticket ID',
                value: `\`${ticket.id}\``,
                inline: true
            },
            {
                name: '📧 Customer',
                value: `${ticket.fullName}\n${ticket.email}`,
                inline: true
            },
            {
                name: '📁 Department',
                value: `${departmentEmojis[ticket.department] || '💬'} ${formatDepartmentName(ticket.department)}`,
                inline: true
            },
            {
                name: '⚡ Priority',
                value: `${priorityEmojis[ticket.priority] || '⚪'} ${ticket.priority.toUpperCase()}`,
                inline: true
            },
            {
                name: '📦 Order Number',
                value: ticket.orderNumber || 'N/A',
                inline: true
            },
            {
                name: '🏷️ Status',
                value: formatStatusName(ticket.status).toUpperCase(),
                inline: true
            },
            {
                name: '📝 Subject',
                value: ticket.subject,
                inline: false
            },
            {
                name: '💭 Message',
                value: truncateMessage(ticket.message, 500),
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'BuildReign Gaming Support System'
        }
    };

    return embed;
}

function formatDepartmentName(dept) {
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

function formatStatusName(status) {
    const statusMap = {
        'open': 'Open',
        'in-progress': 'In Progress',
        'awaiting-reply': 'Awaiting Reply',
        'closed': 'Closed'
    };
    return statusMap[status] || status;
}

function truncateMessage(message, maxLength) {
    if (message.length <= maxLength) {
        return message;
    }
    return message.substring(0, maxLength - 3) + '...';
}

// Export configuration status
function isDiscordConfigured() {
    return DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== '';
}

console.log('🔔 Discord Webhook:', isDiscordConfigured() ? '✅ Configured' : '⚠️ Not configured');
