const modal = $('#exampleModal');

$('textarea#docContent').tinymce({
    height: 500,
    menubar: false,
    toolbar: 'undo redo | blocks | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help',
    selector: 'textarea',
    init_instance_callback: function(editor){
        editor.mode.set("readonly"); // read only so can't edit content
        if(sessionStorage.getItem('currentDocumentID')){
            $.get("http://localhost:8080/document/"+sessionStorage.getItem('currentDocumentID'), function(data) { 
                $('input#docTitle').val(data.title); // set document title
                editor.setContent(data.content);  // set document content
                modal.find('#exampleModalLabel').html(`Checking queue to edit '${data.title}'`)
            });
        }
    }
  });

$(function(){
    // forces user to click close button on modal
    modal.modal({backdrop: 'static', keyboard: false});
    // spinner css after page loads
    $("#cv-spinner").css({
		"height": "100%",
		"display": "flex",
		"justify-content": "center",
		"align-items": "center"
	});
    // hide/uncheck certain elements
    $('#modal-error-message').hide();
    $('#editModeSwitch').prop('checked',false);
});

$('#editModeSwitch').on('change',function(){
    if(this.checked==true){
        modal.modal('show');
        checkEditAccess();
    }
});

$('button.btn-close').on('click', function(){
    modal.modal('hide');
    $('#editModeSwitch').prop('checked',false);
})

function checkEditAccess(){
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/document/"+sessionStorage.getItem('currentDocumentID')+"?user="+sessionStorage.getItem('author')+"?edit=true",
        beforeSend: function(){
            if($('#modal-error-message').is(":visible")) $('#modal-error-message').hide();
            $('#spinner').show();
        },
        complete: function(){
            $('#spinner').hide();
        },
        success: function(){
            window.location = './write.html'; // redirect to write page
        },
        error: function(){
            // 409 if locked
            $('#modal-error-message').show();
        },
    });
}

$('button#edit-request').on('click', function(){
    // "Try again"
    checkEditAccess();
})