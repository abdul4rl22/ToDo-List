function Connection(){
    db = openDatabase("ToDoList", "1", "To Do List", 1024*1024);
    
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS List (Id INTEGER PRIMARY KEY ASC, Title VARCHAR(99) NOT NULL, Description LONGTEXT NOT NULL, Status VARCHAR(99) NOT NULL)", [], SuccessNote, ErrorNote);
    });
}

function Get_All(){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM List", [], renderItems, ErrorNote);
    });
}

function renderItems(tx, rs){
    add = "";
    Completed = document.getElementById('Completed');
    Ongoing = document.getElementById('Ongoing');
    Cancelled = document.getElementById('Cancelled');
    
    Completed.innerHTML = ("<li class=\"header\"><i class=\"fa fa-check\"></i> Completed </li>");
    Ongoing.innerHTML = ("<li class=\"header\"><i class=\"fa fa-circle-notch\"></i> Still Ongoing </li>");
    Cancelled.innerHTML = ("<li class=\"header\"><i class=\"fa fa-times\"></i> Cancelled </li>");
    
    for (i = 0; i < rs.rows.length; i++){
        Title = rs.rows.item(i).Title;
        Id = rs.rows.item(i).Id;
        stats = rs.rows.item(i).Status;
        
        if(stats == 'Completed'){
            Completed.innerHTML += '<li> '+ Title +'  <div class="pull-right"> <button class="cancel" onclick="Delete_Item('+Id+')"> <i class="fa fa-times"></i> </button> </div></li>';
        }else if(stats == 'Ongoing'){
            Ongoing.innerHTML += '<li> '+ Title +' <div class="pull-right"> <button class="edit" onclick="EditItem('+ Id +')"> <i class="fa fa-pen"></i> </button> <button class="complete" onclick="Complete_Item('+Id+')"><i class="fa fa-check"></i></button> <button class="cancel" onclick="Cancel_Item('+Id+')"> <i class="fa fa-times"></i> </button> </div></li>';
        }else if(stats == 'Cancelled'){
            Cancelled.innerHTML += '<li> '+ Title +' <div class="pull-right"> <button class="cancel" onclick="Delete_Item('+Id+')"> <i class="fa fa-times"></i> </button> </div></li>';
        }
    }
}

function Complete_Item(Id){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM List WHERE Id = ?", [Id], ChosenComplete, ErrorNote);
    });
}

function Cancel_Item(Id){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM List WHERE Id = ?", [Id], ChosenCancel, ErrorNote);
    });
}

function Delete_Item(Id){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM List WHERE Id = ?", [Id], ChosenDelete, ErrorNote);
    });
}

function ChosenComplete(tx, rs){
    Id = rs.rows.item(0).Id;
    db.transaction(function(tx){
        tx.executeSql("UPDATE List SET Status = 'Completed' WHERE Id = "+Id, [], Get_All, ErrorNote);
    })
}

function ChosenCancel(tx, rs){
    Id = rs.rows.item(0).Id;
    db.transaction(function(tx){
        tx.executeSql("UPDATE List SET Status = 'Cancelled' WHERE Id = "+Id, [], Get_All, ErrorNote);
    })
}

function ChosenDelete(tx, rs){
    Id = rs.rows.item(0).Id;
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM List WHERE Id = "+Id, [], Get_All, ErrorNote);
    })
}

function EditItem(Id){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM List WHERE Id = ?", [Id], ChosenOne, ErrorNote);
    });
    
}

function ChosenOne(tx, rs){
    Id = rs.rows.item(0).Id;
    Title = rs.rows.item(0).Title;
    Desc = rs.rows.item(0).Description;
    $('.new-to-do').addClass('see');
    $('#Tap_Me').addClass('see');
    $('.to-do-list').addClass('see');
    $('.title').text('Edit List');
    $('.aa').addClass('see');
    $('#Complete').removeClass('off');
    $('#Cancel').removeClass('off');
    $('#Functional').text('Edit Item');
    $('#Functional').attr('onclick', 'Update('+ Id +')');
    $('#Functional').attr('onclick', 'Update('+ Id +')');
    $('#Functional').attr('onclick', 'Update('+ Id +')');
    $('#Title').val(Title);
    $('#Description').val(Desc);
}


function FindOut(){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM List", [], Add_Item, ErrorNote);
    });
}

function Add_Item(){
    Title = $('#Title').val();
    Desc =  $('#Description').val();
    Stats = "Ongoing";
    
    if(Title != '' && Desc != ''){
        db.transaction(function(tx){
            tx.executeSql('INSERT INTO List (Title, Description, Status) VALUES (?, ?, ?)', [Title, Desc, Stats], Get_All, ErrorNote);
        });
    }

    $('#Title').val('');
    $('#Description').val('');
    $('#close_it').click();
    $('.new-to-do').removeClass('see');
    $('#Tap_Me').removeClass('see');
    $('.to-do-list').removeClass('see');
    $('.title').text('To Do List');
    $('.aa').removeClass('see');
    
}

function Update(Id){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM List WHERE Id = ?", [Id], ChosenUpdate, ErrorNote);
    });
}

function ChosenUpdate(tx, rs){
    Title = $('#Title').val();
    Desc =  $('#Description').val();
    Id = rs.rows.item(0).Id;
    db.transaction(function(tx){
        tx.executeSql("UPDATE List SET Title = '"+Title+"', Description = '"+Desc+"' WHERE Id = "+Id, [], Get_All, ErrorNote);
    });
    
    $('#Title').val('');
    $('#Description').val('');
    $('#close_it').click();
    $('.new-to-do').removeClass('see');
    $('#Tap_Me').removeClass('see');
    $('.to-do-list').removeClass('see');
    $('.title').text('To Do List');
    $('.aa').removeClass('see');
}

function ErrorNote(tx, r){
    console.log('Something Is Off.');
}

function SuccessNote(tx, r){
    console.log('We\'re Doing Good Here.');
}

$(document).ready(function(){
    
    Connection();
    Get_All();
    
    $('#Tap_Me').on('click', function(){
        $('.new-to-do').addClass('see');
        $('#Tap_Me').addClass('see');
        $('.to-do-list').addClass('see');
        $('.title').text('Add To List');
        $('.aa').addClass('see');
        $('#Complete').addClass('off');
        $('#Cancel').addClass('off');
        $('#Functional').text('Add To List');
        $('#Functional').attr('onclick', 'Add_Item()');
    })
    
    $('#close_it').on('click', function(){
        $('.new-to-do').removeClass('see');
        $('#Tap_Me').removeClass('see');
        $('.to-do-list').removeClass('see');
        $('.title').text('To Do List');
        $('.aa').removeClass('see');
        $('#Title').val('');
        $('#Description').val('');
        $('#Functional').text('Add To List');
        $('#Functional').attr('onclick', 'Add_Item()');
    })
    
})