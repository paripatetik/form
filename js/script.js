'use strict'

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);

    async function formSend(e){
        e.preventDefault();

        let error = formValidate(form);

        let formData= new FormData(form);  //data from inputs 
        formData.append('image', formImage.files[0]); //image

        if(error===0){
            form.classList.add('_sending');
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if(response.ok){
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';
                form.reset();
                form.classList.remove('_sending');
            } else{
                alert('Error');
                form.classList.remove('_sending');
            }
        } else{
            alert('Fill the neccessary gaps!')
        }
    }

    function formValidate(form) { 
        let error = 0;
        let formReq = document.querySelectorAll('._req');
        formReq.forEach(input => {
            formRemoveError(input);
          
            if(input.classList.contains('_email')){
                if(emailTest(input)){
                    formAddError(input);
                    error++;
                }
            } else if(input.getAttribute('type')=== 'checkbox' && input.checked ===false){
                formAddError(input);
                error++;
            } else {
                if(input.value ===''){
                    formAddError(input);
                    error++;
                }
            }
        });
        return error;
     }

     function formAddError(input){
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
     }
     function formRemoveError(input){
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
     }
     function emailTest(input){
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
     }

     //preview
     const formImage = document.getElementById('formImage');
     const formPreview = document.getElementById('formPreview');

     formImage.addEventListener('change', ()=>{
        uploadFile(formImage.files[0]);
     });
     function uploadFile(file) {
		if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
			alert('Only images are allowed.');
			formImage.value = '';
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			alert('File should be less than 2MB.');
			return;
		}

		let reader = new FileReader();
		reader.onload = function (e) {
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
		};
		reader.onerror = function (e) {
			alert('Error');
		};
		reader.readAsDataURL(file);
	}
}); 