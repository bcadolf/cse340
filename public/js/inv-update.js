const forms = document.querySelectorAll(".account-form")
  forms.forEach((form) => {
    form.addEventListener("change", function () {
      const updateBtn = form.querySelector("button")
      
      updateBtn.removeAttribute("disabled")
    })
  });
    
