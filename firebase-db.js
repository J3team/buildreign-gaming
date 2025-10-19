// Firebase Database Helper Functions
// Handles all ticket storage operations with Firebase/localStorage fallback

// Save ticket to Firebase or localStorage
async function saveTicket(ticket) {
    if (isFirebaseConfigured && db) {
        try {
            await db.collection('tickets').doc(ticket.id).set(ticket);
            console.log('✅ Ticket saved to Firebase:', ticket.id);
            return true;
        } catch (error) {
            console.error('❌ Firebase save error:', error);
            return saveTicketLocal(ticket);
        }
    } else {
        return saveTicketLocal(ticket);
    }
}

// Get all tickets from Firebase or localStorage
async function getTickets() {
    if (isFirebaseConfigured && db) {
        try {
            const snapshot = await db.collection('tickets').get();
            const tickets = [];
            snapshot.forEach(doc => {
                tickets.push(doc.data());
            });
            console.log(`✅ Loaded ${tickets.length} tickets from Firebase`);
            return tickets;
        } catch (error) {
            console.error('❌ Firebase get error:', error);
            return getTicketsLocal();
        }
    } else {
        return getTicketsLocal();
    }
}

// Get single ticket by ID
async function getTicketById(ticketId) {
    if (isFirebaseConfigured && db) {
        try {
            const doc = await db.collection('tickets').doc(ticketId).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('❌ Firebase get error:', error);
            return getTicketByIdLocal(ticketId);
        }
    } else {
        return getTicketByIdLocal(ticketId);
    }
}

// Update ticket in Firebase or localStorage
async function updateTicket(ticketId, updates) {
    if (isFirebaseConfigured && db) {
        try {
            await db.collection('tickets').doc(ticketId).update(updates);
            console.log('✅ Ticket updated in Firebase:', ticketId);
            return true;
        } catch (error) {
            console.error('❌ Firebase update error:', error);
            return updateTicketLocal(ticketId, updates);
        }
    } else {
        return updateTicketLocal(ticketId, updates);
    }
}

// Delete ticket from Firebase or localStorage
async function deleteTicket(ticketId) {
    if (isFirebaseConfigured && db) {
        try {
            await db.collection('tickets').doc(ticketId).delete();
            console.log('✅ Ticket deleted from Firebase:', ticketId);
            return true;
        } catch (error) {
            console.error('❌ Firebase delete error:', error);
            return deleteTicketLocal(ticketId);
        }
    } else {
        return deleteTicketLocal(ticketId);
    }
}

// Get tickets by user email
async function getUserTickets(userEmail) {
    if (isFirebaseConfigured && db) {
        try {
            const snapshot = await db.collection('tickets')
                .where('email', '==', userEmail)
                .get();
            const tickets = [];
            snapshot.forEach(doc => {
                tickets.push(doc.data());
            });
            return tickets;
        } catch (error) {
            console.error('❌ Firebase query error:', error);
            return getUserTicketsLocal(userEmail);
        }
    } else {
        return getUserTicketsLocal(userEmail);
    }
}

// Listen to real-time updates (Firebase only)
function listenToTickets(callback) {
    if (isFirebaseConfigured && db) {
        return db.collection('tickets').onSnapshot(snapshot => {
            const tickets = [];
            snapshot.forEach(doc => {
                tickets.push(doc.data());
            });
            callback(tickets);
        }, error => {
            console.error('❌ Firebase listener error:', error);
        });
    }
    return null;
}

// ============= LocalStorage Fallback Functions =============

function saveTicketLocal(ticket) {
    let tickets = getTicketsLocal();
    const existingIndex = tickets.findIndex(t => t.id === ticket.id);

    if (existingIndex >= 0) {
        tickets[existingIndex] = ticket;
    } else {
        tickets.push(ticket);
    }

    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    console.log('💾 Ticket saved to localStorage:', ticket.id);
    return true;
}

function getTicketsLocal() {
    const ticketsStr = localStorage.getItem('supportTickets');
    return ticketsStr ? JSON.parse(ticketsStr) : [];
}

function getTicketByIdLocal(ticketId) {
    const tickets = getTicketsLocal();
    return tickets.find(t => t.id === ticketId) || null;
}

function updateTicketLocal(ticketId, updates) {
    const tickets = getTicketsLocal();
    const index = tickets.findIndex(t => t.id === ticketId);

    if (index >= 0) {
        tickets[index] = { ...tickets[index], ...updates };
        localStorage.setItem('supportTickets', JSON.stringify(tickets));
        console.log('💾 Ticket updated in localStorage:', ticketId);
        return true;
    }
    return false;
}

function deleteTicketLocal(ticketId) {
    const tickets = getTicketsLocal();
    const filtered = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('supportTickets', JSON.stringify(filtered));
    console.log('💾 Ticket deleted from localStorage:', ticketId);
    return true;
}

function getUserTicketsLocal(userEmail) {
    const allTickets = getTicketsLocal();
    return allTickets.filter(ticket => ticket.email === userEmail);
}

// Check storage status
function getStorageInfo() {
    return {
        isFirebase: isFirebaseConfigured,
        storageType: isFirebaseConfigured ? 'Firebase Firestore' : 'Browser localStorage',
        localTicketCount: getTicketsLocal().length
    };
}

console.log('📦 Storage System:', getStorageInfo().storageType);
