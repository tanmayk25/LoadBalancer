// const e = require("express");

$('textarea#tiny').tinymce({
    height: 500,
    menubar: false,
    selector: 'textarea',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help',
    init_instance_callback: function(editor){
        // TODO: get content from database
        if(sessionStorage.getItem('currentDocumentID')){
            $.get("http://localhost:8080/document/"+sessionStorage.getItem('currentDocumentID'), function(data) {
                editor.setContent(data.content);  
            });
        }
    }
  });

const modal1 = $('#save-ignore-modal');
const modal2 = $('#email-modal');

$(function(){
    // forces user to click close button
    modal1.modal({backdrop: 'static', keyboard: false});
    modal2.modal({backdrop: 'static', keyboard: false});
    // if(!$.session.get("author")){
    //     // show pop up to get email
    //     // modal.modal('show');
    //     sessionStorage.setItem("author", 'alexa');
    // }
});

$('#editModeSwitch').on('change',function(){
    if(this.checked==false) modal.modal('show');
});

$('button.close').on('click', function(){
    modal1.modal('hide');
    $('#editModeSwitch').prop('checked',true);
})

$('button#save').on('click', function(){
    // TODO: pull document ID from database
    saveDoc($('input#docName').val(), tinymce.activeEditor.getContent());
});

$('button#save-changes').on('click', function(){
    saveDoc(0, $('input#docName').val(), tinymce.activeEditor.getContent());
    returnToRead();
});

$('button#ignore-changes').on('click', function(){
    console.log("Danger! Not saving");
    returnToRead();
});

function saveDoc(name, content){
    // console.log(`Sending content for document ${id} to db`);
    console.log(`Document name: ${name}`);
    console.log(`Document content:\n${content}`);
    let requestUrl = 'http://localhost:8080/document/'+sessionStorage.getItem('currentDocumentID'); // update this to whichever POST is
    // TODO: write to database
    let docObj = {
        title: name,
        content: content
    };
    if(!sessionStorage.getItem('currentDocumentID')) {
        requestUrl = 'http://localhost:8080/document/add';
        docObj.title=name; // uncomment once API accepts title change
        if(!sessionStorage.getItem('author')) sessionStorage.setItem("author", 'alexa');
        docObj.author = sessionStorage.getItem('author');
    }
    console.log(docObj);
    $.ajax({
        method: 'POST',
        url: requestUrl,
        contentType: 'application/json',
        data: JSON.stringify(docObj),
        complete: function(){ // should be success
            // window.location = './write.html';
            console.log("Complete!");
        },
        success: function(){
            alert("Saved!");
        }
    });
}

// TODO: return to read page
function returnToRead(){}