import axios from 'axios';

const submitForm = async (formData) => {
    try {
        const response = await axios.post('http://localhost:3000/submit', formData);
        console.log(response.data);
        alert('Form submitted successfully!');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form. Please try again.');
    }
};

document.getElementById('contact-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        name: event.target.name.value,
        email: event.target.email.value,
        message: event.target.message.value,
    };

    submitForm(formData);
});
