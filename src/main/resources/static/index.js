const template = $('tr#template');
// template.hide();

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

// $('button#new-doc').on('click', function(){
//     console.log("creating new doc");
//     $.ajax({
//         method: 'POST',
//         url: "http://localhost:8080/document/add",
//         complete: function(){ // should be success
//             window.location = './write.html';
//         },
//     });
// });

$('button#new-doc').on('click', function(){
    // no express server
    sessionStorage.removeItem('currentDocumentID');
    window.location = './write.html';
});