import { initializeApp } from 'firebase/app'
import 
{ 
    getFirestore, collection, getDocs, onSnapshot,
    addDoc, deleteDoc, doc, updateDoc
} from 'firebase/firestore'
import './styles/buttons.css'
import './styles/grid.css'
import './styles/page.css'
import './styles/snake.css'
// import snakeIcon from './Images/snakeIcon.png.png'

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
    const db = getFirestore(), colRef = collection(db, 'users');
    let usersList = "Nobody just yet.", filteredList = "Empty.", modeFilter = "", speedFilter = "", boardfilter = "-";

    onSnapshot(colRef, (snapshot) => // Automatically update the local list when it changes on the server.
    {
        updateUsersList(snapshot);
    })

    function updateUsersList(snapshot) // Update the local list.
    {
        let users = [];
        snapshot.docs.forEach((doc) => 
        {
            users.push({...doc.data(), id: doc.id});
        })
        usersList = users.concat();
        console.log(usersList);
        filterUserList();
        updateScoreboard(filteredList);
    }

    function sortUsersList() // Sort the users by the score.
    {
        usersList.sort((a, b) => b.score - a.score);
        filteredList.sort((a, b) => b.score - a.score);
    }

    function filterUserList() // Filter the list by active filters.
    {
        filteredList = [];
        usersList.forEach((user) => {if(user.mode.includes(boardfilter))filteredList.push(user);})
    }

    function updateScoreboard(list = usersList) // Update the scoreboard that's on page.
    {
        $("#scoreBoardTable").fadeOut(200);
        setTimeout(function() 
        {
            sortUsersList();
            $('#scoreBoard').html('');
            for (let i = 0; i < 10; i++)
            {
                if(list[i])
                {
                    $('#scoreBoard').append(`<tr><td>${list[i].name}</td><td class="text-end">${list[i].score}</td><td class="text-end">${list[i].mode}</td></tr>`)
                }
                else break;
            }
        }, 200);
        $("#scoreBoardTable").fadeIn(200);
    }

    function getID(name, mode) // Return id by name and mode given.
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

    function deleteUserID(userName, userMode) // Delete an user with a given name and mode.
    {
        let UID = getID(userName, userMode), docRef = doc(db, 'users', UID);
        deleteDoc(docRef);
    }

    function deleteUserAll() // Delete all users.
    {
        usersList.forEach((user) => 
        {
            const docRef = doc(db, 'users', user.id);
            deleteDoc(docRef);
        });
    }

    $(document).on('click', '.mode-pill', function() // Update the mode filter when you click a pill.
    {
        modeFilter = $(this).text() === 'None' ? "" : $(this).text();
        boardfilter = modeFilter+"-"+speedFilter;
        filterUserList();
        updateScoreboard(filteredList);
        console.log(boardfilter);
    });

    $(document).on('click', '.speed-pill', function() // Update the speed filter when you click a pill.
    {
        speedFilter = $(this).text() === 'None' ? "" : $(this).text();
        boardfilter = modeFilter+"-"+speedFilter;
        filterUserList();
        updateScoreboard(filteredList);
        console.log(boardfilter);
    });

    $('#submitModal, #submitMenu').on('click', function(e) // Add or update best score to the db.
    {
        e.preventDefault();
        $('#gameModal').modal('hide');
        let userName = $('#playerName').html(), userMode = $('#playerMode').html(), updatedName = $('#modalName').val();
        if(updatedName)
        {
            userName = updatedName;
            $('#playerName').html(updatedName);
            $('#inputName').val(updatedName);
        } 
        if(userName === 'AdminDeleteAllCommand')
        {
            deleteUserAll();
            return;
        }
        if($('#playerBest').html() < 10)return;
        if(getID(userName, userMode))
        {
            if(isCurrentBetter(userName, userMode))
            {
                let UID = getID(userName, userMode), docRef = doc(db, 'users', UID);
                updateDoc(docRef, {score: $('#playerBest').html()});
            }
        }
        else addDoc(colRef, 
        {
            name: userName,
            score: $('#playerBest').html(),
            mode: userMode,
        })
    })

    $('#refreshMenu').on('click', function() // Manually refresh scoreboard.
    {
        getDocs(colRef)
            .then((snapshot) =>
            {
                updateUsersList(snapshot);
            })
            .catch(err => 
            {
                console.log(err.message);
            });
        
    })

});
