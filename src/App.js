import React, { useEffect, useState } from 'react';
import Overview from './components/Overview';
import uniqid from "uniqid";
import './App.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getFirestore,
  collection, 
  addDoc,
  getDocs, 
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import {
  getAuth, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getPerformance } from 'firebase/performance';

import { getFirebaseConfig } from './firebase-config';
// import { getFirebaseConfig } from './firebase-config.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = getFirebaseConfig();

const App = () => {
  const [taskArray, setTaskArray] = useState([]);
  const [taskInput, setTaskInput] = useState({
                                              text: "", 
                                              id: uniqid(),
                                              editState: false,
                                            });
  const [editInput, setEditInput] = useState("");
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    // console.log("useEffect called!");
    initFirebaseAuth();
    // console.log(isUserSignedIn());
  }, [])

  // Initiate firebase auth
const initFirebaseAuth = () => {
  onAuthStateChanged(getAuth(), authStateObserver)
}

//refactor this for React
const authStateObserver = (user) => {
  console.log(user);
  let userPicElement = document.getElementById('userPic');
  let userNameElement = document.getElementById('userName');
  let signOutButtonElement = document.getElementById('signOut');
  let signInButtonElement = document.getElementById('signIn');
  if (user) {
    // user is signed in!
    // get the signed-in user's profile pic and name
    let profilePicUrl = getProfilePicUrl();
    let userName = getUserName();

    // Set the user's profile pic and name

    // console.log(userPicElement);

    userPicElement.style.backgroundImage = 
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = `${userName}'s Task List`;

    // Show user's profile and sign-out button 
    userNameElement.classList.remove('hidden');
    userPicElement.classList.remove('hidden');
    signOutButtonElement.classList.remove('hidden');

    // Hide sign-in button 
    signInButtonElement.classList.add('hidden');
    console.log(user.uid);
    setUserId(user.uid);


    // loads all tasks after sign in
    loadDBTasks(user.uid);
  } else {
    // user is signed out!
    // Hide user's profile and sign-out button
    userNameElement.classList.add('hidden');
    console.log(userPicElement);
    userPicElement.classList.add('hidden');
    userPicElement.removeAttribute('style');
    signOutButtonElement.classList.add('hidden');

    // Show sign-in button

    signInButtonElement.classList.remove('hidden');

    // Removes all tasks from view
    setTaskArray([]);
    // setUserId(0);
  }
}

// signs into task app
const signIn = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

// signs out of task app
const signOutUser = () => {
  // sign out of firebase
  signOut(getAuth());
}

const getProfilePicUrl = () => {
  return getAuth().currentUser.photoURL || `${process.env.PUBLIC_URL}/logo192.png`;
}

const getUserName = () => {
  return getAuth().currentUser.displayName;
}

const isUserSignedIn = () => {
  console.log(getAuth().currentUser);
  return !!getAuth().currentUser;
}

const saveTask = async (task) => {
  // add a new task entry to firebase database
  try {
    let newTaskData = {
      text: task.text, 
      id: task.id,
      timestamp: serverTimestamp(),
    }
    const newDocRef = doc(getFirestore(), userId, task.id);
    await setDoc(newDocRef, newTaskData);
  }
  catch (error) {
    console.error('Error writing new task to Firebase Database', error);
  }
}

const deleteTaskByID = async (id) => {
  const taskDocRef = doc(getFirestore(), userId, id);
  await deleteDoc(taskDocRef);

  console.log(id);
  return id;
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

  const addTask = (e) => {
    e.preventDefault();
    if (isUserSignedIn()) {
      saveTask(taskInput);
      setTaskInput({
        text: "",
        id: uniqid(),
        editState: false,
      });
      loadDBTasks(userId);
    } else {
      alert("You can't do that if not signed in!")
    }

  }

  const handleNameChange = (e) => {
    setTaskInput({ 
      text: e.target.value,
      id: taskInput.id,
      editState: taskInput.editState
    });
  }

  const handleEditChange = (e) => {
    console.log(e.target.value);
    setEditInput(e.target.value)
  }

  const deleteClickedTask = (e) => {
    if (isUserSignedIn()) {
      const clickedTaskID = e.target.parentNode.getAttribute("data-task-id");
      deleteTaskByID(clickedTaskID);
      setTaskArray(taskArray.filter((task) => task.id !== clickedTaskID));
    } else {
      alert("You must be signed it to do that!")
    }


  }

  const makeTaskEditable = (e) => {
    if (isUserSignedIn()) {
      // console.log(e.target.parentNode.getAttribute("data-task-id"));
      const clickedTaskID = e.target.parentNode.getAttribute("data-task-id");
      let tmpArray = [].concat(taskArray);
      console.log(tmpArray);
      // Reset editState for other tasks that may be selected
      tmpArray = resetEditStates(tmpArray);
      console.log(tmpArray);
      const oldTask = findTask(clickedTaskID);
      const taskIndex = findIndex(clickedTaskID);
      const editableTask = {...oldTask, editState: !oldTask.editState};
      tmpArray[taskIndex] = editableTask;
      setTaskArray(tmpArray);
    } else {
      alert("You must be signed it to do that!")
    }

  }

  const resetEditStates = (tmpArray) => {
    return tmpArray.map((task) => {
      console.log(task);
      return {
        ...task,
        editState: false
      }
    })
  }

  const findIndex = (id) => {
    return taskArray.findIndex((task) => task.id === id);
  }

  const findTask = (id) => {
    return taskArray.find(task => task.id === id);
  }

  const addEditedTask = async (e) => {
    
    if (isUserSignedIn()) {

      console.log(e.target);

      const editedTaskId = e.target.parentNode.getAttribute("data-task-id");

      const editedTaskRef = doc(getFirestore(), userId, editedTaskId);
      let tmpArray = [].concat(taskArray);
      const taskToEdit = findTask(editedTaskId);
      const taskIndex = findIndex(editedTaskId);
      const editedTask = {...taskToEdit, text: editInput, editState: false};
      tmpArray[taskIndex] = editedTask;
      // tmpArray = resetEditStates(tmpArray);
      setTaskArray(tmpArray);
      // loadDBTasks();
      setEditInput("");
      await setDoc(editedTaskRef, { text: editInput }, { merge: true });
    } else {
      alert("You must be signed it to do that!")
    }
  }

  const loadDBTasks =  async (userId) => {
    // console.log("loadDBTasks Called");
    // Create query to load tasks and listen for new ones
    console.log(userId);
    const allTasksQuery = query(collection(getFirestore(), userId), orderBy('timestamp', 'desc'));

    // get all tasks from db
    const dbTasks = await getDocs(allTasksQuery);
    // console.log(dbTasks);
    const tasks = dbTasks.docs.map( doc => doc.data());
    // console.log(tasks);
    // create new array and push tasks from db to it
    let tmpArray = [];
    tasks.forEach((task) => {
      // console.log(task);
      tmpArray.push({ text: task.text, id: task.id, editState: false });
    })
    // console.log(tmpArray);
    setTaskArray(tmpArray);
    setUserId(userId);
  };


  return (
    <div className="App">
      <nav>
        <div id='userContainer'>
          <div id='userPic' className='hidden'></div>
          <h1 id='userName' className='hidden'></h1>
          <button id='signOut' className='hidden' onClick={ signOutUser } >Sign Out</button>
          <button id='signIn' onClick={ signIn }> <i className='material-icons'>account_circle</i>Sign-in with Google</button>
        </div>
      </nav>
      <form action="submit" onSubmit={ addTask } style={{ display: "flex"}}>
        <input 
          type="text" 
          id='taskInput' 
          onChange={ handleNameChange } 
          value={ taskInput.text } 
          placeholder="Enter task here..." 
        />
        <button 
          type='submit' 
          style={{ border: "none", background: "none", padding: 0, zIndex: 2}} 
          className="material-icons">
              add_task
        </button>
      </form>
      <Overview 
        tasks={ taskArray } 
        deleteTask={ deleteClickedTask } 
        setTaskEdit={ makeTaskEditable } 
        addEditedTask={ addEditedTask } 
        handleEditChange={ handleEditChange }
      />
      <div className='totalTasksContainer'>
        <h2>Total Tasks</h2>
        <p>{ taskArray.length }</p>
      </div>

    </div>
  );


}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

getPerformance();

export default App;
