document.addEventListener('DOMContentLoaded', () => {
  const food1s = document.getElementById('food1');
  const food2s = document.getElementById('food2');
  const food3s = document.getElementById('food3');
  const foods = document.querySelector('.right');

  if (foods) {
    foods.style.backgroundImage = "url('biryani.png')";
    foods.style.backgroundSize = 'cover';
    foods.style.backgroundPosition = 'center';
  }

  if (food1s && foods) {
    food1s.addEventListener('click', () => {
      foods.style.backgroundImage = "url('biryani.png')";
      foods.style.backgroundSize = 'cover';
      foods.style.backgroundPosition = 'center';
    });
  }

  if (food2s && foods) {
    food2s.addEventListener('click', () => {
      foods.style.backgroundImage = "url('cury_with_bread.png')";
      foods.style.backgroundSize = 'contain';
      foods.style.backgroundPosition = 'center';
    });
  }

  if (food3s && foods) {
    food3s.addEventListener('click', () => {
      foods.style.backgroundImage = "url('idli.png')";
      foods.style.backgroundSize = 'contain';
      foods.style.backgroundPosition = 'center';
    });
  }

  const feedbackForm = document.getElementById('feedbackForm');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = {
        name: this.name.value.trim(),
        email: this.email.value.trim(),
        message: this.message.value.trim()
      };

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit feedback');
        }

        alert('Thank you for your feedback!');
        this.reset();
      } catch (error) {
        console.error(error);
        alert('Unable to submit feedback right now. Please try again later.');
      }
    });
  }
});
