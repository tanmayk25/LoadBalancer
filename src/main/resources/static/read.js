const modal = $('#exampleModal');
let docID = sessionStorage.getItem('currentDocumentID');
$.get("http://localhost:8080/document/"+docID, function(data) {
    $('input#docTitle').val(data.title); // document title
    $('textarea#docContent').val(data.content); // document content
});


$(function(){
    // forces user to click close button
    modal.modal({backdrop: 'static', keyboard: false});
});

$('#editModeSwitch').on('change',function(){
    if(this.checked==true){
        modal.modal('show');
    }
});

$('button.close').on('click', function(){
    modal.modal('hide');
    $('#editModeSwitch').prop('checked',false);
})

$('button#edit-request').on('click', function(){
    const user = $('input#user-id').val();
    if(user){
        console.log(`Checking with leader for user ${user}...`);
        // TODO: check with leader, redirect to write page if successful
        window.location = './write.html';
    } else {
        console.log('No email provided')
    }
})