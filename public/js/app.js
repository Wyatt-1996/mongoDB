$(document).ready(function () {
    
    // scrape new articles
    $('.scrape-btn').on('click', function () {
        $.get('/scrape', function (response) {
            //console.log(response);
            var numOfArticles = response.length;
            alert('Added ' + numOfArticles + ' New Articles!');
            location.reload();
        });
    });

    // clear all scraped articles
    $('.clear-all').on('click', function () {
        $.get('/clear', function (response) {
            //alert('All articles cleared');
            location.reload();
        });
    });

    // save article
    $('.save-btn').on('click', function () {
        // for modal
        var title = $(this).attr('title');
        $('.note-title').empty();
        $('.note-title').append('"' + title + '"');

        // to actually save
        var id = $(this).attr('info');
        $.ajax({
            method: "POST",
            url: "/saved/" + id
        });
    });

    // remove saved article
    $('.remove-btn').on('click', function () {
        var id = $(this).attr('info');
        console.log(id + ' removed')
        $.ajax({
            method: "POST",
            url: "/delete/" + id
        }).done(function (data) {
            window.location.reload();
            window.location = "/saved"
        });
    });

    // notes modal
    $('.notes-btn').on('click', function () {
        var title = $(this).attr('info');
        $('.note-title').empty();
        $('.note-title').append('"' + title + '"');
    });

    // save note
    $('.save-note').on('click', function () {
        
        var thisId = $('.notes-btn').attr("id");
        console.log(thisId);
        //location.reload();
        
        // if ($("#note-content-" + thisId).val() == "") {
        //     alert("Note cannot be blank!")
        // } else {
        //     $.ajax({
        //         method: "POST",
        //         url: "/notes/save/" + thisId,
        //         data: {
        //             text: $("#note-content-" + thisId).val()
        //         }
        //     }).done(function (data) {
        //         console.log(data);
        //         $("#note-content-" + thisId).val("");
        //         $(".note-modal").modal("hide");
        //         window.location = "/saved"
        //     });
        // };

    });


//doc.ready
});