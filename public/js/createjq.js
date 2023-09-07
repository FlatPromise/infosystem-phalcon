var hobbiesArray = [];
$(function () {
  if ($('#hobby-main').val() != '') {
    $('#add-hobby-button').prop('disabled', false);
  }

  $('input[name=alphanumonly]').keypress(function (e) {
    let regex = new RegExp('^[a-zA-Z0-9\\-\\s]+$');
    if (e.charCode != 0) {
      let key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (!regex.test(key)) {
        return false;
      }
    }
  });

  $('input[name=alphanumonly], #email, #address').blur(function (e) {
    $(this).val($(this).val().trim());
  });

  $('#contact').keypress(function (e) {
    var charCode = e.which ? e.which : e.keycode;

    if (String.fromCharCode(charCode).match(/[^0-9]/g)) return false;
  });

  $('#bdaydefault').change(function (e) {
    e.preventDefault();

    let rawDate = $(this).val();

    if (rawDate === '') {
      $('#bdayconverted').val('');
      return;
    }

    let d = new Date(rawDate);

    month = '' + (d.getMonth() + 1);
    day = '' + d.getDate();
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    $('#bdayconverted').val([year, month, day].join('-'));
  });

  $('#create-button').click(function (e) {
    e.preventDefault();

    let fail = false;

    let fnameSelector = $('#fname');
    let mnameSelector = $('#mname');
    let lnameSelector = $('#lname');
    let emailSelector = $('#email');
    let bdayConvertedSelector = $('#bdayconverted');
    let bdayDefaultSelector = $('#bdaydefault');
    let addressSelector = $('#address');
    let contactSelector = $('#contact');
    let hobbiesSelector = $('#hobby-main');

    let fnameHelpSelector = $('#fname-empty');
    let lnameHelpSelector = $('#lname-empty');
    let emailHelpSelector = $('#email-empty');
    let bdayHelpSelector = $('#bday-empty');
    let contactHelpSelector = $('#contact-empty');
    let hobbiesHelpSelector = $('#hobbies-empty');
    let addressHelpSelector = $('#address-empty');

    fnameSelector.removeClass('is-danger');
    lnameSelector.removeClass('is-danger');
    emailSelector.removeClass('is-danger');
    bdayDefaultSelector.removeClass('is-danger');
    addressSelector.removeClass('is-danger');
    contactSelector.removeClass('is-danger');
    hobbiesSelector.removeClass('is-danger');

    fnameHelpSelector.hide();
    lnameHelpSelector.hide();
    bdayHelpSelector.hide();
    emailHelpSelector.hide();
    addressHelpSelector.hide();
    contactHelpSelector.hide();
    hobbiesHelpSelector.hide();

    //First Name Validation
    let fname = fnameSelector.val();
    if (fname === '') {
      fnameSelector.addClass('is-danger');
      fnameHelpSelector.show();
      fail = true;
    }

    let mname = mnameSelector.val();

    //Last Name Validation
    let lname = lnameSelector.val();
    if (lname === '') {
      lnameSelector.addClass('is-danger');
      lnameHelpSelector.show();
      fail = true;
    }

    //Email Validation
    let email = emailSelector.val();
    if (email === '' || !validateEmail(email)) {
      emailSelector.addClass('is-danger');
      emailHelpSelector.show();
      fail = true;
    }

    //Bday Validation
    let bday = bdayConvertedSelector.val();
    if (bday === '') {
      bdayDefaultSelector.addClass('is-danger');
      bdayHelpSelector.show();
      fail = true;
    }

    //Address Validation
    let address = addressSelector.val();
    if (address === '') {
      addressSelector.addClass('is-danger');
      addressHelpSelector.show();
      fail = true;
    }

    //Contact Number Validation
    let contact = contactSelector.val();
    if (contact === '' || !validatePhone(contact)) {
      contactSelector.addClass('is-danger');
      contactHelpSelector.show();
      fail = true;
    }

    //Hobbies Validation
    let hobbies = hobbiesSelector.val();
    if (hobbies === '') {
      hobbiesSelector.addClass('is-danger');
      hobbiesHelpSelector.show();
      fail = true;
    }

    if (!fail) {
      let out = {
        fname: fname,
        mname: mname,
        lname: lname,
        email: email,
        bday: bday,
        address: address,
        contact: contact,
        hobbies: hobbies,
      };
      deleteEmptyHobbySubInputs();
      getHobbyInputs();

      let formData = new FormData();
      let urlParams = new URLSearchParams(window.location.search);
      formData.append('fname', fnameSelector.val());
      formData.append('mname', mnameSelector.val());
      formData.append('lname', lnameSelector.val());
      formData.append('email', emailSelector.val());
      formData.append('address', addressSelector.val());
      formData.append('contact', contactSelector.val());
      formData.append('hobbies', hobbiesArray);
      formData.append('bday', bdayConvertedSelector.val());
      if (urlParams.has('target-id'))
        formData.append('user-id', urlParams.get('target-id'));

      $.ajax({
        type: 'POST',
        url: '/infosystem-phalcon/users/create',
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
          if (response === 'Success') {
            alert('User Has Been Created');
            window.location.href = '/infosystem-phalcon/users';
          } else {
            alert('An Error has Occured');
          }
        },
      });
    }
  });

  $('#edit-button').click(function (e) {
    e.preventDefault();

    let fail = false;

    let fnameSelector = $('#fname');
    let mnameSelector = $('#mname');
    let lnameSelector = $('#lname');
    let emailSelector = $('#email');
    let bdayConvertedSelector = $('#bdayconverted');
    let bdayDefaultSelector = $('#bdaydefault');
    let addressSelector = $('#address');
    let contactSelector = $('#contact');
    let hobbiesSelector = $('#hobby-main');

    let fnameHelpSelector = $('#fname-empty');
    let lnameHelpSelector = $('#lname-empty');
    let emailHelpSelector = $('#email-empty');
    let bdayHelpSelector = $('#bday-empty');
    let contactHelpSelector = $('#contact-empty');
    let hobbiesHelpSelector = $('#hobbies-empty');
    let addressHelpSelector = $('#address-empty');

    fnameSelector.removeClass('is-danger');
    lnameSelector.removeClass('is-danger');
    emailSelector.removeClass('is-danger');
    bdayDefaultSelector.removeClass('is-danger');
    addressSelector.removeClass('is-danger');
    contactSelector.removeClass('is-danger');
    hobbiesSelector.removeClass('is-danger');

    fnameHelpSelector.hide();
    lnameHelpSelector.hide();
    bdayHelpSelector.hide();
    emailHelpSelector.hide();
    addressHelpSelector.hide();
    contactHelpSelector.hide();
    hobbiesHelpSelector.hide();

    //First Name Validation
    let fname = fnameSelector.val();
    if (fname === '') {
      fnameSelector.addClass('is-danger');
      fnameHelpSelector.show();
      fail = true;
    }

    let mname = mnameSelector.val();

    //Last Name Validation
    let lname = lnameSelector.val();
    if (lname === '') {
      lnameSelector.addClass('is-danger');
      lnameHelpSelector.show();
      fail = true;
    }

    //Email Validation
    let email = emailSelector.val();
    if (email === '' || !validateEmail(email)) {
      emailSelector.addClass('is-danger');
      emailHelpSelector.show();
      fail = true;
    }

    //Bday Validation
    let bday = bdayConvertedSelector.val();
    if (bday === '') {
      bdayDefaultSelector.addClass('is-danger');
      bdayHelpSelector.show();
      fail = true;
    }

    //Address Validation
    let address = addressSelector.val();
    if (address === '') {
      addressSelector.addClass('is-danger');
      addressHelpSelector.show();
      fail = true;
    }

    //Contact Number Validation
    let contact = contactSelector.val();
    if (contact === '' || !validatePhone(contact)) {
      contactSelector.addClass('is-danger');
      contactHelpSelector.show();
      fail = true;
    }

    //Hobbies Validation
    let hobbies = hobbiesSelector.val();
    if (hobbies === '') {
      hobbiesSelector.addClass('is-danger');
      hobbiesHelpSelector.show();
      fail = true;
    }

    if (!fail) {
      let out = {
        fname: fname,
        mname: mname,
        lname: lname,
        email: email,
        bday: bday,
        address: address,
        contact: contact,
        hobbies: hobbies,
      };
      deleteEmptyHobbySubInputs();
      getHobbyInputs();

      let formData = new FormData();
      let urlParams = new URLSearchParams(window.location.search);
      formData.append('fname', fnameSelector.val());
      formData.append('mname', mnameSelector.val());
      formData.append('lname', lnameSelector.val());
      formData.append('email', emailSelector.val());
      formData.append('address', addressSelector.val());
      formData.append('contact', contactSelector.val());
      formData.append('hobbies', hobbiesArray);
      formData.append('bday', bdayConvertedSelector.val());
      if (urlParams.has('target-id'))
        formData.append('user-id', urlParams.get('target-id'));

      $.ajax({
        type: 'POST',
        url: '/infosystem-phalcon/users/edit',
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
          if (response === 'Success') {
            alert('User Has Been Editted');
            window.location.href = '/infosystem-phalcon/users';
          } else {
            alert('An Error has Occured');
          }
        },
      });
    }
  });

  $('#cancel').click(function (e) {
    e.preventDefault();
    window.location.href = 'index.html';
  });

  //actively get data from input boxes, incl. dynamically created ones
  $('#hobbies-container').on('keyup', "input[name='hobby-input']", function () {
    deleteEmptyHobbySubInputs();

    $("input[name='hobby-input']").each((index, element) => {
      if ($(this).val() === '' && $(this).attr('id') != 'hobby-main') {
        $(this).parent().parent().remove();
      }
    });

    getHobbyInputs();
  });

  //actively check if there is input in the first input box
  $('#hobbies-container').on(
    'keyup',
    "input[name='hobby-input']:first",
    function () {
      if ($(this).val().length != 0)
        $('#add-hobby-button').prop('disabled', false);
      else $('#add-hobby-button').prop('disabled', true);
    },
  );

  //spawns dynamic elements for hobbies input
  $('#add-hobby-button').click(function (e) {
    e.preventDefault();

    deleteEmptyHobbySubInputs();

    let hobbiesSelector = $('#hobby-main');
    let hobbiesHelpSelector = $('#hobbies-empty');
    hobbiesSelector.removeClass('is-danger');
    hobbiesHelpSelector.hide();

    let htmlToSpawn = `
    <div class='field'>
      <div class='control'>
        <input 
          required 
          type='text' 
          name='hobby-input' 
          id='hobbies-sub' 
          placeholder='Hobbies' 
          class='input' />
      </div>
    </div>
    `;
    $('#hobbies-container>div>div>input[name=hobby-input]')
      .parent()
      .parent()
      .parent()
      .append(htmlToSpawn);
  });
});

//search for empty elements in hobbies. delete if matching type
function deleteEmptyHobbySubInputs() {
  $("input[name='hobby-input']").each((index, element) => {
    if (element.value === '' && $(element).attr('id') === 'hobbies-sub') {
      $(element).parent().parent().remove();
    }
  });
}

function getHobbyInputs() {
  hobbiesArray = [];
  $("input[name='hobby-input']").each((index, element) => {
    hobbiesArray.push(element.value);
  });
}

function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function validatePhone(number) {
  if (/09\d{9}/.test(number)) return true;
  return false;
}
