document.addEventListener('DOMContentLoaded', function () {
    // Admin panelinde kartları yükle
    loadCards();
});

// Sabit kartları ve localStorage'daki güncellenmiş kartları alır
function getCards() {
    // LocalStorage'da kartlar varsa onları al, yoksa sabit kartları getir
    return JSON.parse(localStorage.getItem('cards')) || getPredefinedCards();
}

// Kartları admin paneline yükler
function loadCards() {
    const cards = getCards(); // LocalStorage veya sabit kartları al
    const cardsContainer = document.getElementById('cardsContainer');
    if (!cardsContainer) {
        console.error("Admin paneli kart container'ı bulunamadı!");
        return;
    }
    cardsContainer.innerHTML = '';  // Mevcut kartları temizle

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'col-md-3';
        cardElement.innerHTML = `
            <div class="card h-100">
                <div class="card-body text-center">
                    <h5 class="card-title">${card.membershipType}</h5>
                    <label>Seans Sayısı:</label>
                    <input type="number" class="form-control mb-2" id="sessions-${index}" value="${card.sessions}" placeholder="Seans Sayısı" min="1">
                    <label>Fiyat (TL):</label>
                    <input type="number" class="form-control mb-2" id="price-${index}" value="${card.price}" placeholder="Fiyat" min="1">
                    <button class="btn btn-primary" onclick="updateCard(${index})">Güncelle</button>
                </div>
            </div>
        `;
        cardsContainer.appendChild(cardElement);
    });
}

// Sabit kartlar
function getPredefinedCards() {
    return [
        { membershipType: 'Aylık Üyelik', sessions: 4, price: 100 },
        { membershipType: '3 Aylık Üyelik', sessions: 12, price: 90 },
        { membershipType: '6 Aylık Üyelik', sessions: 24, price: 85 },
        { membershipType: 'Yıllık Üyelik', sessions: 48, price: 80 }
    ];
}

// Kartı günceller ve localStorage'a kaydeder
function updateCard(index) {
    const sessionsInput = document.getElementById(`sessions-${index}`);
    const priceInput = document.getElementById(`price-${index}`);

    if (sessionsInput && priceInput) {
        // Input değerlerini kontrol et ve geçersiz giriş durumlarını ele al
        const updatedSessions = parseInt(sessionsInput.value, 10);
        const updatedPrice = parseFloat(priceInput.value);

        if (isNaN(updatedSessions) || isNaN(updatedPrice) || updatedSessions <= 0 || updatedPrice <= 0) {
            alert("Lütfen geçerli bir seans ve fiyat giriniz.");
            return;
        }

        let cards = getCards(); // Kartları al
        cards[index].sessions = updatedSessions;
        cards[index].price = updatedPrice;

        // Kartları localStorage'a kaydet
        localStorage.setItem('cards', JSON.stringify(cards));

        // Başarılı güncelleme mesajı
        alert(`${cards[index].membershipType} başarıyla güncellendi!`);
    } else {
        console.error('Kart güncellenemedi, girişler bulunamadı.');
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Sayfa yüklendiğinde mesajları yükleyelim
    loadMessages();

    // Mesaj formunu dinleyelim
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Formun varsayılan gönderimini engelle

            // Formdaki verileri al
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!fullName || !email || !message) {
                alert("Lütfen tüm alanları doldurun.");
                return;
            }

            // Yeni mesajı oluştur
            const newMessage = { fullName, email, message };

            // LocalStorage'da mevcut mesajları al
            let messages = JSON.parse(localStorage.getItem('messages')) || [];

            // Yeni mesajı ekle
            messages.push(newMessage);

            // LocalStorage'a kaydet
            localStorage.setItem('messages', JSON.stringify(messages));

            // Formu temizle
            messageForm.reset();

            // Mesajları yeniden yükle
            loadMessages();
        });
    }
});

// Mesajları localStorage'dan alıp tabloya ekler
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const tableBody = document.getElementById('messagesTableBody');

    if (!tableBody) {
        console.error("Mesaj tablosu bulunamadı!");
        return;
    }

    tableBody.innerHTML = ''; // Tabloyu temizle

    messages.forEach((msg, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${msg.fullName}</td>
            <td>${msg.email}</td>
            <td>${msg.message}</td>
            <td><button class="btn btn-danger" onclick="deleteMessage(${index})">Sil</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Mesajı sil
function deleteMessage(index) {
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.splice(index, 1); // İlgili mesajı diziden sil
    localStorage.setItem('messages', JSON.stringify(messages)); // Güncellenmiş diziyi kaydet
    loadMessages(); // Tabloyu tekrar yükle
}
