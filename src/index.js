import { initializeApp } from 'firebase/app'
import 
{ 
    getFirestore, collection, getDocs,
    addDoc, deleteDoc, doc
} from 'firebase/firestore'

$(document).ready(function()
{
    const firebaseConfig = // Firebase api configuration.
    {
        apiKey: "AIzaSyAGxvhSXjtLWppZTL9_pNfiCdTd6W0MnrE",
        authDomain: "snake-project-eduard.firebaseapp.com",
        projectId: "snake-project-eduard",
        storageBucket: "snake-project-eduard.appspot.com",
        messagingSenderId: "780087792230",
        appId: "1:780087792230:web:c5beaf4162eeaf12e6d3a7"
    };

    initializeApp(firebaseConfig);
    const db = getFirestore();
    const colRef = collection(db, 'users');
    let usersList = "Nobody just yet.";
    function updateUsersList() // Update the local scoreboard from db.
    {
        getDocs(colRef)
            .then((snapshot) =>  // Get the list from the server.
            {
                let users = [];
                snapshot.docs.forEach((doc) => 
                {
                    users.push({...doc.data(), id: doc.id});
                })
                usersList = users.concat();
                console.log(usersList);
                updateScoreboard();
            })
            .catch(err => 
            {
                console.log(err.message);
            });
    }

    console.log("Initial users:");
    updateUsersList();

    $('#submitModal, #submitMenu').on('click', function(e) // Add best score of current player to the db.
    {
        e.preventDefault();
        $('#gameModal').modal('hide');
        let usrName = $('#playerName').html();
        let usrMode = $('#playerMode').html();
        let updatedName = $('#modalName').val();
        if(updatedName)
        {
            usrName = updatedName;
            $('#playerName').html(updatedName);
            $('#inputName').val(updatedName);
        } 
        if(usrName === 'AdminDeleteAllCommand')
        {
            deleteUserAll();
            return;
        }
        if($('#playerBest').html() < 10)return;
        if(getIdByNameAndMode(usrName, usrMode))
        {
            if(isCurrentBetter(usrName, usrMode))deleteUserID(usrName, usrMode);
            else return;
        }
        addDoc(colRef, 
        {
            name: $('#playerName').html(),
            score: $('#playerBest').html(),
            mode: $('#playerMode').html(),
        })
        .then(() => 
        {
            console.log('Updated users:');
            updateUsersList();
        })
    })

    $('#refreshMenu').on('click', function() // Refresh scoreboard.
    {
        updateUsersList();
    })

    function sortUsersList() // Sort the users by the score.
    {
        usersList.sort((a, b) => b.score - a.score);
    }

    function updateScoreboard() // Update the scoreboard that's on page.
    {
        $("#scoreBoardTable").fadeOut(200);
        setTimeout(function() 
        {
            sortUsersList();
            $('#scoreBoard').html('');
            for (let i = 0; i < 10; i++)
            {
                if(usersList[i])
                {
                    $('#scoreBoard').append(`<tr><td>${usersList[i].name}</td><td class="text-end">${usersList[i].score}</td><td class="text-end">${usersList[i].mode}</td></tr>`)
                }
                else break;
            }
        }, 200);
        $("#scoreBoardTable").fadeIn(200);
    }

    function getIdByNameAndMode(name, mode) // Return id by name and mode given.
    {
        const item = usersList.find((obj) => obj.name === name && obj.mode === mode);
        return item ? item.id : null;
    }

    function isCurrentBetter(name, mode) // Check if the current score is better than what's online.
    {
        const current = parseInt($('#playerBest').html());
        const online = parseInt(usersList.find((obj) => obj.name === name && obj.mode === mode).score);
        return current > online;
    }

    function deleteDocument(docRef) // Call firebase function to delete the doc.
    {
        deleteDoc(docRef)
            .then(() => 
            {
                updateUsersList();
            })
    }

    function deleteUserID(userName, userMode) // Delete an user with a given name and mode.
    {
        let UID = getIdByNameAndMode(userName, userMode), docRef = doc(db, 'users', UID);
        console.log("Deleted user ", userName);
        deleteDocument(docRef);
    }

    function deleteUserAll() // Delete all users.
    {
        usersList.forEach((user) => 
        {
            const docRef = doc(db, 'users', user.id);
            deleteDocument(docRef);
        });
    }
});
