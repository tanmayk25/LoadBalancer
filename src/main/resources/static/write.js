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
        if(sessionStorage.getItem('currentDocumentID')){
            // $.get("http://localhost:8080/document/"+sessionStorage.getItem('currentDocumentID')+"?user="+"&edit=true", function(data) {
            //     $('input#docName').val(data.title); // set document title
            //     editor.setContent(data.content);  // set document content
            // });
            // this was easier than figuring out how to pass the object from read.js
            $.ajax({
                method: 'GET',
                // assuming api call GET http://localhost:8080/document/6297e25965bdf90c83f73686?user=bbb&edit=true requests edit access
                url: "http://localhost:8080/document/"+sessionStorage.getItem('currentDocumentID')+"?user="+sessionStorage.getItem('author')+"?edit=true",
                success: function(){
                    $('input#docName').val(data.title); // set document title
                    editor.setContent(data.content);  // set document content
                },
                error: function(){
                    alert("Sorry, something went wrong");
                    window.location = './read.html';
                },
            });
        }
    }
  });

const modal1 = $('#save-ignore-modal');
const modal2 = $('#author-modal');

$(function(){
    // forces user to click close button
    modal1.modal({backdrop: 'static', keyboard: false});
    modal2.modal({backdrop: 'static', keyboard: false});

    // author must provide name
    if(!sessionStorage.getItem('author')){
        modal2.modal('show');
    }
});

// if user tries to exit edit mode
$('#editModeSwitch').on('change',function(){
    if(this.checked==false) modal1.modal('show');
});

// sets author name in session, hides modal
$('button#author-submit').on('click', function(){
    sessionStorage.setItem('author', $('input#user-id').val());
    modal2.modal('hide');
});

$('button#save-ignore-close').on('click', function(){
    modal1.modal('hide');
    $('#editModeSwitch').prop('checked',true);
});

$('button#save').on('click', function(){
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
    let requestUrl = 'http://localhost:8080/document/'+sessionStorage.getItem('currentDocumentID')+'?user='+sessionStorage.getItem("author");
    let docObj = {
        title: name,
        content: content
    };
    // new document
    if(!sessionStorage.getItem('currentDocumentID')) {
        requestUrl = 'http://localhost:8080/document/add'; // switch url
        docObj.author = sessionStorage.getItem('author'); // add author to object
    }
    console.log(docObj);
    $.ajax({
        method: 'POST',
        url: requestUrl,
        contentType: 'application/json',
        data: JSON.stringify(docObj),
        success: function(){
            alert('Saved!');
        },
        error: function(){
            alert('Sorry, something went wrong');
        },
    });
}

function returnToRead(){
    $.ajax({
        method: 'POST',
        url: '/document/releaseLock/'+sessionStorage.getItem('currentDocumentID'),
        complete: function(){
            window.location = './read.html';
        }
    });
}