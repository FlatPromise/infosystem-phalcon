$(function () {
  $(document).on('click', "button[name='target-user-delete']", function () {
    if (confirm('Are you sure you want to delete this entry?')) {
      let formData = new FormData();
      formData.append('target-user', $(this).val());
      $.ajax({
        type: 'POST',
        url: '/infosystem-phalcon/users/delete',
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
          if (response === 'deleted') {
            alert('User has been deleted!');
            window.location.href = '/infosystem-phalcon-older/users';
          } else {
            alert('An error has occured');
          }
        },
      });
    }
  });
});

function getFullName(fname, mname, lname) {
  if (mname) return fname + ' ' + mname + ' ' + lname;
  return fname + ' ' + lname;
}
