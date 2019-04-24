$(".save-button").unbind().on("click", function(){

    let id = $(this).attr("data-id");

    console.log(id);

    $.ajax("/articles/" + id, {
    type: "PUT",
    data: {"saved": true}
    }).then(() => {
        location.reload();
        console.log("saved article");
    });
})

$(".unsave-button").unbind().on("click", function(){

    let id = $(this).attr("data-id");

    console.log(id);

    $.ajax("/articles/" + id, {
    type: "PUT",
    data: {"saved": false}
    }).then(() => {
        location.reload()
        console.log("unsaved article");
    });
})

$("#scrape").unbind().on("click", function(){
    $.get("/scrape", function(req, res){
        console.log("hey");
        location.reload()
    })
})