console.log("JS loaded!");


// Form validation (5.1)
$(function () {
  // Password strength helper
  function passwordStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[\W_]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    if (score <= 1) return "weak";
    if (score <= 3) return "medium";
    return "strong";
  }

  // Password strength real-time
  if ($("#password").length) {
    $("#password").on("input", function () {
      const val = $(this).val();
      const strength = passwordStrength(val);
      const el = $("#password-strength");
      el.removeClass("weak medium strong").addClass(strength);
      el.text("Strength: " + strength);
    });
  }

  // Real-time validation
  if ($("#name").length) {
    $("#name").on("input blur", function () {
      const val = $(this).val().trim();
      const err = $(this).siblings(".error-message");
      if (val.length < 2) err.text("Name must be at least 2 characters.");
      else if (/[#@&!]/.test(val))
        err.text("Name contains invalid characters.");
      else err.text("");
    });
  }

  if ($("#email").length) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $("#email").on("input blur", function () {
      const val = $(this).val().trim();
      const err = $(this).siblings(".error-message");
      if (!emailRegex.test(val))
        err.text("Please enter a valid email address.");
      else err.text("");
    });
  }

  if ($("#password_confirm, #password").length) {
    $("#password_confirm, #password").on("input blur", function () {
      const pw = $("#password").val();
      const confirm = $("#password_confirm").val();
      const err = $("#password_confirm").siblings(".error-message");
      if (confirm && pw !== confirm) err.text("Passwords do not match.");
      else err.text("");
    });
  }

  if ($("#message").length) {
    $("#message").on("input blur", function () {
      const val = $(this).val().trim();
      const words = val.split(/\s+/).filter(Boolean).length;
      const err = $(this).siblings(".error-message");
      if (words < 2) err.text("Your message must have at least 2 words.");
      else err.text("");
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      document
        .querySelectorAll(".error-message")
        .forEach((msg) => (msg.textContent = ""));

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");

      if (name.value.trim().length < 2) {
        name.nextElementSibling.textContent =
          "Name must be at least 2 characters.";
        isValid = false;

        //regular expressions
      } else if (/[#@&!]/.test(name.value)) {
        name.nextElementSibling.textContent =
          "Name cannot contain such symbols.";
        isValid = false;
      }

      if (email.value.trim().length < 2) {
        email.nextElementSibling.textContent =
          "Email must be at least 2 characters.";
        isValid = false;
      }

      const wordCount = message.value
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      if (wordCount < 2) {
        message.nextElementSibling.textContent =
          "Your message must contain at least two words.";
        isValid = false;
      }

      if (!isValid) return;

      // If valid, show success and reset
      const successMsg = document.createElement("div");
      successMsg.className = "alert alert-success mt-3";
      successMsg.textContent = "Thanks! Your message was sent.";
      contactForm.parentNode.insertBefore(successMsg, contactForm);
      $(successMsg)
        .hide()
        .fadeIn(400)
        .delay(2000)
        .fadeOut(600, function () {
          $(this).remove();
          contactForm.reset();
          if ($("#password-strength").length) $("#password-strength").text("");
        });
    });
  }

  // Accordion toggle (used animations: slideToggle, sideUp)
  $(".accordion-header").click(function () {
    const content = $(this).next(".accordion-content");
    content.stop(true, true).slideToggle(300);
    $(".accordion-content").not(content).slideUp(300);
    $(this).parent(".accordion-item").toggleClass("active");
    $(".accordion-item").not($(this).parent()).removeClass("active");
  });

  // Dynamic Search Functionality (5.2)
  if ($("#product-search").length) {
    $("#product-search").on("input", function () {
      const q = $(this).val().toLowerCase();
      $(".item-card").each(function () {
        const title = (
          $(this).data("title") || $(this).find(".item-card-h").text()
        ).toLowerCase();

        if (title.indexOf(q) !== -1) $(this).show();
        else $(this).hide();
      });
    });
  }
});

// Dynamic Table with CRUD Operations (5.4)
$(document).ready(function () {
  let items = []; // data array
  let editingIndex = null;

  // Render table
  function renderTable() {
    const tbody = $("#items-table tbody");
    tbody.empty();
    items.forEach((item, index) => {
      const row = $(`
        <tr>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.price}</td>
          <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        </tr>
      `);
      row.appendTo(tbody);
    });
  }

  // Add/Edit modal
  $("#add-item-btn").click(() => {
    editingIndex = null;
    $("#item-form")[0].reset();
    $("#item-modal").fadeIn();
  });

  $("#close-modal").click(() => $("#item-modal").fadeOut());

  $("#item-form").submit(function (e) {
    e.preventDefault();
    const newItem = {
      name: $("#item-name").val(),
      category: $("#item-category").val(),
      price: $("#item-price").val(),
    };

    if (editingIndex !== null) {
      items[editingIndex] = newItem;
    } else {
      items.push(newItem);
    }

    renderTable();
    $("#item-modal").fadeOut();
  });

  // Delete row
  $(document).on("click", ".delete-btn", function () {
    const rowIndex = $(this).closest("tr").index();
    if (confirm("Are you sure you want to delete this item?")) {
      items.splice(rowIndex, 1);
      $(this)
        .closest("tr")
        .fadeOut(400, function () {
          $(this).remove();
        });
    }
  });

  // Edit row
  $(document).on("click", ".edit-btn", function () {
    editingIndex = $(this).closest("tr").index();
    const item = items[editingIndex];
    $("#item-name").val(item.name);
    $("#item-category").val(item.category);
    $("#item-price").val(item.price);
    $("#item-modal").fadeIn();
  });

  // Search
  $("#table-search").on("input", function () {
    const q = $(this).val().toLowerCase();
    $("#items-table tbody tr").each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.indexOf(q) !== -1);
    });
  });

  renderTable();
});

// Image Gallery with Filtering and Lightbox (5.5)
$(document).ready(function () {
  const buttons = document.querySelectorAll(".category-filters button");
  const cards = document.querySelectorAll(".gallery-grid .g-card");

  const images = Array.from(cards).map((card) => card.querySelector("img").src);
  let currentIndex = 0;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category").toLowerCase();
      cards.forEach((card) => {
        console.log("card.dataset=", card);
        if (
          category === "all" ||
          card.dataset.category.toLowerCase() === category
        ) {
          $(card).stop(true, true).fadeIn(300);
        } else {
          card.style.display = "none";
        }
      });
    });

    //light box
    const Lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lb-img");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        console.log("card clicked", card);
        const imgSrc = card.querySelector("img").src;
        lbImg.src = imgSrc;
        Lightbox.classList.remove("hide");

        currentIndex = index;
        $("#lb-img").attr("src", images[currentIndex]);
        $("#lightbox").fadeIn(200);
      });
    });

    $("#lb-prev").on("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      $("#lb-img").fadeOut(150, function () {
        $(this).attr("src", images[currentIndex]).fadeIn(150);
      });
    });

    $("#lb-next").on("click", () => {
      currentIndex = (currentIndex + 1 + images.length) % images.length;
      $("#lb-img").fadeOut(150, function () {
        $(this).attr("src", images[currentIndex]).fadeIn(150);
      });
    });

    const LightboxBtnClose = document.getElementById("lb-close");
    LightboxBtnClose.addEventListener("click", () => {
      Lightbox.classList.add("hide");
    });
  });
});

//menu animation (slideToggle)
$(document).ready(function () {
  $(".hamburger").click(function () {
    if ($(window).width() <= 991) {
      $(".menu").stop(true, true).slideToggle(300);
    }
  });

  $(window).resize(function () {
    if ($(window).width() > 991) {
      $(".menu").show();
    } else {
      $(".menu").hide();
    }
  });
});

// Modal or Popup Interaction (5.3)
$(document).ready(function () {
  const productModalEl = document.getElementById("productModal");
  const productModal = new bootstrap.Modal(productModalEl);

  document
    .querySelectorAll(".ingredients-container .card a")
    .forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const card = link.closest(".card");
        const title = card.querySelector("h2").textContent;
        const imgSrc = card.querySelector("img").src;
        const desc = card.querySelector("p").textContent;

        document.getElementById("product-title").textContent = title;
        document.getElementById("product-img").src = imgSrc;
        document.getElementById("product-desc").textContent = desc;

        productModal.show();
      });
    });
});
