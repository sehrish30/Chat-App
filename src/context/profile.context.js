import React, { createContext, useState, useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';

// We'll create two constants which we will write to
// the Realtime database when this device is offline
// or online.
export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

//We need a provider to provide all its children with this profile context
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusRef;
    const authUnsubscribe = auth.onAuthStateChanged(authObj => {
      //Now unsubscribe from on listener on database

      //State management from display name incase of any change this will update
      if (authObj) {
        // Create a reference to this user's specific status node.
        // This is where we will store data about being online/offline.
        userStatusRef = database.ref(`/status/${authObj.uid}`);
        userRef = database.ref(`/profiles/${authObj.uid}`);
        userRef.on('value', snap => {
          // const profileData = snap.val(); //profile data is data of database
          const { name, createdAt, avatar } = snap.val();
          const data = {
            name,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
            avatar,
          };
          setProfile(data);
          setIsLoading(false);
        });

        // Create a reference to the special '.info/connected' path in
        // Realtime Database. This path returns `true` when connected
        // and `false` when disconnected.
        database.ref('.info/connected').on('value', snapshot => {
          // If we're not currently connected, don't do anything.
          //Probably it wont be bool so convert it !! to bool
          if (!!snapshot.val() === false) {
            return;
          }

          // If we are currently connected, then use the 'onDisconnect()'
          // method to add a set which will only trigger once this
          // client has disconnected by closing the app,
          // losing internet, or any other means.
          userStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              // The promise returned from .onDisconnect().set() will
              // resolve as soon as the server acknowledges the onDisconnect()
              // request, NOT once we've actually disconnected:
              // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

              // We can now safely set ourselves as 'online' knowing that the
              // server will mark us as offline once we lose connection.
              userStatusRef.set(isOnlineForDatabase);
            });
        });
      } else {
        //Unsubscribing
        if (userRef) {
          userRef.off();
        }

        if (userStatusRef) {
          userStatusRef.off();
        }
        database.ref('.info/connected').off();

        setProfile(null);
        setIsLoading(false);
      }
    });
    //This is cleanup func for useeffect whwen component in unmounted
    return () => {
      authUnsubscribe();
      database.ref('.info/connected').off();

      if (userRef) {
        userRef.off();
      }

      if (userStatusRef) {
        userStatusRef.off();
      }
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

//Another hook wrapper for profile context
//useContntext return value
export const useProfile = () => useContext(ProfileContext);

/**--------------------------------------
MAnaged profile as global state Can be accessed from any componenet
Any component in profileprovider can access its context
---------------------------------------- */
