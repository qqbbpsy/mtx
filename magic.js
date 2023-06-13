var pagination = document.querySelector(".pagination");

// Generate the initial pagination buttons
updatePagination(1);

function updatePagination(currentPage) {
  var gallery = document.querySelector(".gallery");
  var totalImages = parseInt(gallery.getAttribute("data-total-images"));
  var imagesPerPage = 15;
  var totalPages = Math.ceil(totalImages / imagesPerPage);

  // Remove any existing pagination buttons
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }

  // Generate new pagination buttons based on the total number of pages
  if (totalPages > 1) {
    var startPage = 1;
    var endPage = Math.min(totalPages, 4);

    if (currentPage > 3 && currentPage < totalPages - 1) {
      startPage = currentPage - 2;
      endPage = currentPage + 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
      endPage = totalPages;
    }

    var previousButton = createNavigationButton("«");
    previousButton.addEventListener("click", function () {
      if (currentPage > 1) {
        var prevPage = currentPage - 1;
        updatePagination(prevPage);
        showPage(prevPage, imagesPerPage);
      }
    });
    pagination.appendChild(previousButton);

    if (startPage > 1) {
      var firstPageButton = createPaginationButton(1);
      firstPageButton.addEventListener("click", function () {
        updatePagination(1);
        showPage(1, imagesPerPage);
      });
      pagination.appendChild(firstPageButton);
    }

    for (var i = startPage; i <= endPage; i++) {
      var pageButton = createPaginationButton(i);
      pageButton.addEventListener("click", function () {
        var pageNum = parseInt(this.innerHTML);
        updatePagination(pageNum);
        showPage(pageNum, imagesPerPage);
      });

      if (i === currentPage) {
        pageButton.classList.add("active");
      }

      pagination.appendChild(pageButton);
    }

    if (endPage < totalPages) {
      var lastPageButton = createPaginationButton(totalPages);
      lastPageButton.addEventListener("click", function () {
        updatePagination(totalPages);
        showPage(totalPages, imagesPerPage);
      });
      pagination.appendChild(lastPageButton);
    }

    var nextButton = createNavigationButton("»");
    nextButton.addEventListener("click", function () {
      if (currentPage < totalPages) {
        var nextPage = currentPage + 1;
        updatePagination(nextPage);
        showPage(nextPage, imagesPerPage);
      }
    });
    pagination.appendChild(nextButton);
  }

  showPage(currentPage, imagesPerPage);
}

function createPaginationButton(label) {
  var button = document.createElement("button");
  button.innerHTML = label;
  return button;
}

function createNavigationButton(label) {
  var button = document.createElement("button");
  button.innerHTML = label;
  return button;
}

function showPage(page, imagesPerPage) {
  var gallery = document.querySelector(".gallery");
  var totalImages = parseInt(gallery.getAttribute("data-total-images"));
  var startIndex = (page - 1) * imagesPerPage;
  var endIndex = Math.min(startIndex + imagesPerPage, totalImages);

  // Show or hide images based on the current page
  var images = gallery.querySelectorAll("img");
  for (var i = 0; i < totalImages; i++) {
    if (i >= startIndex && i < endIndex) {
      images[i].style.display = "block";
    } else {
      images[i].style.display = "none";
    }
  }

  lazyLoad.update(); // re-scan the page for new images to load

  // Remove the active class from all pagination buttons
  var paginationButtons = document.querySelectorAll(".pagination button");
  paginationButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  // Add the active class to the current page button
  var currentPageButton = document.querySelector(
    ".pagination button:nth-child(" + (page + 2) + ")"
  );
  if (currentPageButton) {
    currentPageButton.classList.add("active");
  }
}

var lazyLoad = new LazyLoad({
  threshold: 500,
  throttle: 30
});