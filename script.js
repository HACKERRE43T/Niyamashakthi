let responses = {};

async function loadResponses() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        responses = await response.json();
        console.log('Responses loaded:', responses); // Debugging: check if responses are loaded
    } catch (error) {
        console.error('Failed to load responses:', error);
    }
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const response = getResponse(userInput);
    const conversation = document.getElementById('conversation');
    conversation.innerHTML += `<div><b>You:</b> ${userInput}</div>`;
    conversation.innerHTML += `<div><b>NiyamaShakthi:</b> ${response}</div>`;
    document.getElementById('userInput').value = ''; // Clear input field
    speakResponse(response);
}

function getResponse(input) {
    return responses[input] || "I'm sorry, I don't have an answer for that question.";
}

function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        document.getElementById('userInput').value = speechResult;
        sendMessage();
    };
    recognition.start();
}

function speakResponse(response) {
    const utterance = new SpeechSynthesisUtterance(response);
    // Find a female voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.name.includes('Google UK English Female') || voice.name.includes('Google US English Female') || voice.name.includes('Microsoft Zira') || voice.name.includes('Samantha'));
    
    // If a female voice is found, use it, otherwise default to the first available voice
    utterance.voice = femaleVoice || voices[0];
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
}

// Page load events and animation handling
document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.querySelector('.loading-overlay');

    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500); 
    }, 2000);

    // Particle effect creation (optional for enhancing the graphics)
    function createParticles() {
        const particleCount = 100;
        const particlesContainer = document.createElement('div');
        particlesContainer.style.position = 'absolute';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // Intro and chat visibility handling
    setTimeout(() => {
        const introSection = document.getElementById('intro');
        introSection.style.transition = 'opacity 1s ease';
        introSection.style.opacity = '0';

        setTimeout(() => {
            introSection.style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
        }, 1000);
    }, 3000); // Show intro for 3 seconds
});

// Load responses when the page loads
window.onload = loadResponses;
