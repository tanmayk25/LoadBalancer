const template = $('tr#template');
// template.hide();
const modal = $('#author-modal');

$(function(){
    modal.modal({backdrop: 'static', keyboard: false});
    if(!sessionStorage.getItem('author')){
        // author must provide name, will be helpful for read/checking edit access
        modal.modal('show');
    }
});

$.get("http://localhost:8080/document/all", function(data) {
    for(doc of data){
        const newDoc = template.clone();
        newDoc.find('td.doc-name').html(doc.title);
        newDoc.find('td.author').html(doc.author);
        newDoc.find('td.created-date').html(doc.createdDate);
        newDoc.find('td.version').html(doc.version);
        newDoc[0].id=doc.id;
        $("tbody").append(newDoc);
        newDoc.show();
    }
    $('tr').on('click', function(){
        sessionStorage.setItem("currentDocumentID", $(this)[0].id);
        window.location = './read.html';
    });
});

$('button#new-doc').on('click', function(){
    sessionStorage.removeItem('currentDocumentID');
    window.location = './write.html';
});

$('button#author-submit').on('click', function(){
    sessionStorage.setItem('author', $('input#user-id').val());
    modal.modal('hide');
});