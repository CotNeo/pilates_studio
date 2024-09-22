      // Randevu formu gönderildiğinde bildirim göster
      document.getElementById('appointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Form verilerini alabilir ve backend'e gönderebilirsiniz.
        document.getElementById('appointmentAlert').classList.remove('d-none');
    });
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const appointmentData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          date: document.getElementById('date').value,
          time: document.getElementById('time').value,
          membership: document.querySelector('input[name="membership"]:checked').value
      };

      fetch('http://localhost:3000/appointments', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData),
      })
      .then(response => response.text())
      .then(data => {
          document.getElementById('appointmentAlert').classList.remove('d-none');
      })
      .catch((error) => {
          console.error('Hata:', error);
      });
  });
  document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Formdaki değerleri al
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Yerel depolamada saklanacak mesajlar dizisini al
    let messages = JSON.parse(localStorage.getItem('messages')) || [];

    // Yeni mesajı diziye ekle
    messages.push({ fullName, email, message });

    // Güncellenmiş diziyi localStorage'de sakla
    localStorage.setItem('messages', JSON.stringify(messages));

    // Formu temizle
    document.getElementById('messageForm').reset();

    alert('Mesajınız kaydedildi!');
});
document.addEventListener('DOMContentLoaded', function() {
    loadCardsInIndex(); // Sayfa yüklendiğinde kartları yükle
});

function loadCardsInIndex() {
    const cardsContainer = document.getElementById('cardsContainerIndex');
    if (!cardsContainer) {
        console.error("Kartlar container'ı bulunamadı!");
        return;
    }

    cardsContainer.innerHTML = '';  // Mevcut kartları temizle

    let cards = JSON.parse(localStorage.getItem('cards')) || getPredefinedCards();

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'col-md-3';
        cardElement.innerHTML = `
            <div class="card h-100">
                <div class="card-body text-center">
                    <input type="radio" name="membership" value="${card.membershipType}">
                    <label class="form-check-label">
                        <h5 class="card-title">${card.membershipType}</h5>
                        <p class="card-text">${card.sessions} Seans</p>
                        <p class="card-text">Seans Başı Ücret: ${card.price} TL</p>
                    </label>
                </div>
            </div>
        `;
        cardsContainer.appendChild(cardElement);
    });
}

// Sabit kartları getir
function getPredefinedCards() {
    return [
        { membershipType: 'Aylık Üyelik', sessions: 4, price: 100 },
        { membershipType: '3 Aylık Üyelik', sessions: 12, price: 90 },
        { membershipType: '6 Aylık Üyelik', sessions: 24, price: 85 },
        { membershipType: 'Yıllık Üyelik', sessions: 48, price: 80 }
    ];
}
