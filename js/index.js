document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.features-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,

    navigation: {
      nextEl: '.button-next',
      prevEl: '.button-prev',
    },

    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      991: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

});

document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.services-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,

    navigation: {
      nextEl: '.button-ser-next',
      prevEl: '.button-ser-prev',
    },

    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      991: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

});

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });

// ------------------------------------------- //

Dropzone.autoDiscover = false;

document.addEventListener('DOMContentLoaded', function() {
    const myDropzone = new Dropzone("#myDropzone", {
        url: "http://localhost:8000/api/ikhwanetwork/contact",
        autoProcessQueue: false,
        maxFilesize: 2,
        acceptedFiles: ".jpg,.jpeg,.png,.pdf,.xlsx,.docx",
        addRemoveLinks: true,
        dictDefaultMessage: "",
        dictFileTooBig: "File is too big ({{filesize}}MB). Maximum size: {{maxFilesize}}MB.",
        dictInvalidFileType: "This file type is not allowed.",
        dictRemoveFile: "Remove file",
        init: function() {
            this.on("addedfile", function(file) {
                if (file.name.length > 30) {
                    const truncatedName = file.name.substring(0, 30) + '...';
                    file.previewElement.querySelector(".dz-filename span").textContent = truncatedName;
                    file.previewElement.querySelector(".dz-filename span").title = file.name;
                }
            });

            const form = document.getElementById('contactForm');
            const submitBtn = document.querySelector('.submit-btn');
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = document.getElementById("name").value.trim();
                const email = document.getElementById("email").value.trim();
                const phone = document.getElementById("phone").value.trim();
                
                if (!name) {
                    showAlert("Name field is required", "danger");
                    return;
                }
                
                if (!email) {
                    showAlert("Email field is required", "danger");
                    return;
                } else if (!/^\S+@\S+\.\S+$/.test(email)) {
                    showAlert("Invalid email format", "danger");
                    return;
                }
                
                if (!phone) {
                    showAlert("Phone field is required", "danger");
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Sending...
                `;

                const formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("phone", phone);
                formData.append("description", document.getElementById("description").value);
                
                if (document.getElementById("radio1").checked) formData.append("option", "Inquiry");
                else if (document.getElementById("radio2").checked) formData.append("option", "Suggestion");
                else if (document.getElementById("radio3").checked) formData.append("option", "Complaint");

                if (myDropzone.files.length > 0) {
                    formData.append("file", myDropzone.files[0]);
                }

                try {
                    const response = await fetch("/contact-proxy.php", {
                        method: "POST",
                        body: formData,
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        showAlert("Message sent successfully", "success");
                        
                        form.reset();
                        myDropzone.removeAllFiles();
                    } else {
                        showAlert(result.message || "Failed to send message", "danger");
                    }
                    
                } catch (error) {
                    showAlert("Error connecting to server", "danger");
                    console.error(error);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send";
                }
            });
        }
    });
});

function showAlert(message, type) {
    const oldAlert = document.querySelector('.alert');
    if (oldAlert) oldAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form.nextSibling);
    
    setTimeout(() => alertDiv.remove(), 5000);
}
