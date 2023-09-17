const container = document.querySelector('.containerm');

window.addEventListener('scroll', () => {
  const containerPosition = container.getBoundingClientRect().top;
  if (containerPosition < window.innerHeight) {
    container.classList.add('active');
  }
});

const textElement = document.querySelector('.text');
const windowHeight = window.innerHeight;

function checkPosition() {
  const elementTop = textElement.getBoundingClientRect().top;
  if (elementTop - windowHeight <= 0) {
    textElement.classList.add('active');
    window.removeEventListener('scroll', checkPosition);
  }
}

window.addEventListener('scroll', checkPosition);
