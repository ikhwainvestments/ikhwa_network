Dropzone.autoDiscover = false;

document.addEventListener('DOMContentLoaded', function () {
    const myDropzone = new Dropzone("#myDropzone", {
        url: "http://localhost:8000/api/ikhwanetwork/job", // Use a proxy if the API does not support HTTPS
        autoProcessQueue: false,
        maxFilesize: 5, // Updated to 5MB
        acceptedFiles: ".jpg,.jpeg,.png,.pdf,.xlsx,.docx",
        addRemoveLinks: true,
        dictDefaultMessage: "",
        dictFileTooBig: "The file is too large ({{filesize}}MB). Maximum allowed size: {{maxFilesize}}MB.",
        dictInvalidFileType: "This file type is not allowed.",
        dictRemoveFile: "Remove file",
        init: function () {
            this.on("addedfile", function (file) {
                if (file.name.length > 30) {
                    const truncatedName = file.name.substring(0, 30) + '...';
                    file.previewElement.querySelector(".dz-filename span").textContent = truncatedName;
                    file.previewElement.querySelector(".dz-filename span").title = file.name;
                }
            });

            const form = document.getElementById('jobForm');
            const submitBtn = document.querySelector('.submit-btn');

            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const name = document.getElementById("name").value.trim();
                const email = document.getElementById("email").value.trim();
                const phone = document.getElementById("phone").value.trim();
                const birthdate = document.getElementById("birthdate").value.trim();
                const address = document.getElementById("address").value.trim();
                const education = document.getElementById("education").value.trim();
                const description = document.getElementById("description").value.trim();

                if (!name) return showAlert("Full name is required", "danger");
                if (!email || !/^\S+@\S+\.\S+$/.test(email)) return showAlert("A valid email is required", "danger");
                if (!phone) return showAlert("Phone number is required", "danger");

                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Sending...
                `;

                const formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("phone", phone);
                formData.append("birthdate", birthdate);
                formData.append("address", address);
                formData.append("education", education);
                formData.append("description", description);

                // Selected option
                if (document.getElementById("radio1").checked) formData.append("option", "Inquiry");
                else if (document.getElementById("radio2").checked) formData.append("option", "Suggestion");
                else if (document.getElementById("radio3").checked) formData.append("option", "Complaint");

                // File upload
                if (myDropzone.files.length > 0) {
                    formData.append("file", myDropzone.files[0]);
                }

                try {
                    const response = await fetch("/job-form-handler.php", {
                        method: "POST",
                        body: formData,
                    });

                    const result = await response.json();

                    if (response.ok) {
                        showAlert("Application submitted successfully", "success");
                        form.reset();
                        myDropzone.removeAllFiles();
                    } else {
                        showAlert(result.message || "Failed to submit the application", "danger");
                    }

                } catch (error) {
                    showAlert("An error occurred while connecting to the server", "danger");
                    console.error(error);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit";
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

    const form = document.getElementById('jobForm');
    form.parentNode.insertBefore(alertDiv, form.nextSibling);

    setTimeout(() => alertDiv.remove(), 5000);
}
