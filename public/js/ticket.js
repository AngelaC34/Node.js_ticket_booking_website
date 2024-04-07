angular.module('myApp', []).controller('AppController', function ($scope, $http) {
  $scope.formData = {}; // Inisialisasi objek buat simpan data

  $scope.submitForm = function () {
    // menangkap data form
    $scope.formData.name = $scope.name;
    $scope.formData.attractionName = getAttractionName($scope.selectedAttraction);
    $scope.formData.ticket = $scope.ticket;
    $scope.formData.date = $scope.date;
    $scope.formData.phone = $scope.phone;
    $scope.formData.email = $scope.email;
    $scope.formData.bookingID = generateBookingID($scope.selectedAttraction, $scope.ticket);
    // Menampilkan data dengan pop up

    showPopup($scope.formData);

    $http.post('/api/booking', $scope.formData)
      .then(function (response) {
        console.log('Form data submitted successfully:', response.data);
        alert('Form submitted successfully!');
      })
      .catch(function (error) {
        console.error('Error submitting form data:', error);
        alert('Error submitting form data. Please try again.');
      });
  };

  function generateBookingID(selectedAttraction, ticket) {
    var attractionCode = '';
    switch (selectedAttraction) {
        case 'A':
            attractionCode = 'FD';
            break;
        case 'B':
            attractionCode = 'CF';
            break;
        case 'C':
            attractionCode = 'FF';
            break;
        case 'D':
            attractionCode = 'SO';
            break;
    }
    return attractionCode + Date.now().toString() + ticket;
  }

  function getAttractionName(selectedAttraction) {
    var attractionName = '';
    switch (selectedAttraction) {
        case 'A':
          attractionName = 'Flower Dome';
          break;
        case 'B':
          attractionName = 'Cloud Forest';
          break;
        case 'C':
          attractionName = 'Floral Fantasy';
          break;
        case 'D':
          attractionName = 'Supertree Observatory';
          break;
    }
    return attractionName;
  }
});

  function createPopup(formData) {
    // Buat elemen div baru untuk popup
    const popup = document.createElement('div');

    // style popup
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.background = 'rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = 10000000;

    // buat konten popup
    const popupContent = document.createElement('div');
    popupContent.style.width = '400px';
    popupContent.style.margin = 'auto';
    popupContent.style.background = 'white';
    popupContent.style.padding = '20px';
    popupContent.style.borderRadius = '8px';
    popupContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popupContent.style.animation = 'fadeIn 0.3s ease-in-out';

    // memanggil pop up konten ke popup
    popup.appendChild(popupContent);

    // Judul
    const popupTitle = document.createElement('h1');
    popupTitle.textContent = 'Thank You!';
    popupTitle.style.fontSize = '24px';
    popupTitle.style.fontWeight = 'bold';
    popupTitle.style.color = '#218838';
    popupTitle.style.marginBottom = '10px';
    popupContent.appendChild(popupTitle);

    // Form
    const labels = {
      name: 'Name:',
      attractionName: 'Attraction:',
      ticket: 'Ticket:',
      date:'Date:',
      phone: 'Phone number:',
      email: 'Email address:',
      bookingID: 'Booking ID:'
    };

    for (const key in formData) {
      const label = document.createElement('label');
      label.textContent = labels[key];
      label.style.display = 'block';
      label.style.marginBottom = '5px';
      popupContent.appendChild(label);

      const value = document.createElement('span');
      value.textContent = formData[key];
      value.style.display = 'block';
      popupContent.appendChild(value);
    }

    // Buat tombol konfirmasi popup dan style
    const popupConfirmButton = document.createElement('button');
    popupConfirmButton.textContent = 'Confirm';
    popupConfirmButton.style.marginTop = '20px';
    popupConfirmButton.style.padding = '10px 20px';
    popupConfirmButton.style.backgroundColor = '#218838';
    popupConfirmButton.style.color = '#fff';
    popupConfirmButton.style.border = 'none';
    popupConfirmButton.style.borderRadius = '4px';
    popupConfirmButton.style.cursor = 'pointer';
    popupConfirmButton.style.transition = 'background-color 0.3s ease-in-out';

    // buat addEventListener untuk menutup popup
    popupConfirmButton.addEventListener('click', function () {
      popup.remove();
    });

    popupContent.appendChild(popupConfirmButton);

    return popup;
  }


  function showPopup(formData) {
    console.log('Form Data: ', formData);
  
    // Buat popup dengan data
    const popup = createPopup(formData);
  
    // panggil ke appendChild
    document.body.appendChild(popup);
  }

  