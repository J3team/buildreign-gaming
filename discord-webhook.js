// Discord Webhook Integration for Support Tickets
// Configure your Discord webhook URL below

// ============= CONFIGURATION =============
// To set up Discord webhook:
// 1. Go to your Discord server settings
// 2. Navigate to Integrations > Webhooks
// 3. Click "New Webhook"
// 4. Name it "BuildReign Support"
// 5. Copy the webhook URL and paste it below

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1429470806416691211/jkYVVKjFC6bIW7j0FClKsk1Q4WXqx7LnBnTUKh5CX0fFMFQNjJ7hSzffJvN8FkiKApiB'; // Paste your Discord webhook URL here
const SUPPORT_ROLE_ID = '1429470660828205106'; // Role ID to ping for new tickets

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
            username: 'BuildReign Support Bot',
            avatar_url: 'https://via.placeholder.com/128/00ff88/1a1a2e?text=BR',
            content: type === 'new' ? `<@&${SUPPORT_ROLE_ID}> **New Support Ticket!**` : null,
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
        'new': 0x00ff88,      // BuildReign Green
        'reply': 0x0088ff,    // BuildReign Blue
        'update': 0xffa500,   // Orange
        'closed': 0x808080    // Gray
    };

    const priorityEmojis = {
        'low': '🟢',
        'medium': '🟡',
        'high': '🟠',
        'critical': '🔴⚠️'
    };

    const priorityColors = {
        'low': '`LOW`',
        'medium': '`MEDIUM`',
        'high': '`HIGH`',
        'critical': '`🚨 CRITICAL 🚨`'
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

    const statusEmojis = {
        'open': '🆕',
        'in-progress': '⏳',
        'awaiting-reply': '⏰',
        'closed': '✅'
    };

    let title = '';
    let description = '';

    switch (type) {
        case 'new':
            title = '🎫 NEW SUPPORT TICKET RECEIVED';
            description = '**A customer needs assistance!**\n━━━━━━━━━━━━━━━━━━━━━━';
            break;
        case 'reply':
            title = '💬 CUSTOMER REPLY RECEIVED';
            description = '**A customer has responded to their ticket.**\n━━━━━━━━━━━━━━━━━━━━━━';
            break;
        case 'update':
            title = '🔄 TICKET STATUS UPDATE';
            description = '**A ticket has been updated.**\n━━━━━━━━━━━━━━━━━━━━━━';
            break;
        case 'closed':
            title = '✅ TICKET RESOLVED';
            description = '**A support ticket has been closed.**\n━━━━━━━━━━━━━━━━━━━━━━';
            break;
    }

    const embed = {
        author: {
            name: 'BuildReign Gaming Support',
            icon_url: 'https://via.placeholder.com/64/00ff88/1a1a2e?text=BR'
        },
        title: title,
        description: description,
        color: colors[type] || colors['new'],
        fields: [
            {
                name: '\u200B',
                value: '**📋 TICKET INFORMATION**',
                inline: false
            },
            {
                name: '🆔 Ticket ID',
                value: `\`\`\`${ticket.id}\`\`\``,
                inline: true
            },
            {
                name: '🏷️ Status',
                value: `${statusEmojis[ticket.status] || '❓'} **${formatStatusName(ticket.status).toUpperCase()}**`,
                inline: true
            },
            {
                name: '⚡ Priority Level',
                value: `${priorityEmojis[ticket.priority] || '⚪'} ${priorityColors[ticket.priority]}`,
                inline: true
            },
            {
                name: '\u200B',
                value: '**👤 CUSTOMER DETAILS**',
                inline: false
            },
            {
                name: '📧 Name',
                value: `**${ticket.fullName}**`,
                inline: true
            },
            {
                name: '✉️ Email',
                value: `\`${ticket.email}\``,
                inline: true
            },
            {
                name: '📦 Order #',
                value: ticket.orderNumber ? `\`${ticket.orderNumber}\`` : '`N/A`',
                inline: true
            },
            {
                name: '\u200B',
                value: '**📁 TICKET DETAILS**',
                inline: false
            },
            {
                name: '📂 Department',
                value: `${departmentEmojis[ticket.department] || '💬'} **${formatDepartmentName(ticket.department)}**`,
                inline: false
            },
            {
                name: '📝 Subject',
                value: `**${ticket.subject}**`,
                inline: false
            },
            {
                name: '💬 Message',
                value: `>>> ${truncateMessage(ticket.message, 800)}`,
                inline: false
            }
        ],
        thumbnail: {
            url: 'https://via.placeholder.com/256/00ff88/1a1a2e?text=TICKET'
        },
        timestamp: new Date().toISOString(),
        footer: {
            text: '🎮 BuildReign Gaming Support System | Respond ASAP',
            icon_url: 'https://via.placeholder.com/32/00ff88/1a1a2e?text=⚡'
        }
    };

    // Add urgency indicator for high/critical priority
    if (ticket.priority === 'critical' || ticket.priority === 'high') {
        embed.fields.unshift({
            name: '⚠️ URGENT ATTENTION REQUIRED',
            value: `**This is a ${ticket.priority.toUpperCase()} priority ticket!**\n${ticket.priority === 'critical' ? '🚨 **IMMEDIATE RESPONSE NEEDED** 🚨' : '⏰ **Please respond within 6 hours**'}`,
            inline: false
        });
    }

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
    return message.substring(0, maxLength - 20) + '...\n\n`[Message truncated]`';
}

// Export configuration status
function isDiscordConfigured() {
    return DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== '';
}

console.log('🔔 Discord Webhook:', isDiscordConfigured() ? '✅ Configured' : '⚠️ Not configured');
