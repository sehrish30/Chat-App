import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, database } from '../misc/firebase';

const ProfileContext = createContext();

//We need a provider to provide all its children with this profile context
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    const authUnsubscribe = auth.onAuthStateChanged(authObj => {
      //Now unsubscribe from on listener on database

      //State management from display name incase of any change this will update
      if (authObj) {
        userRef = database.ref(`/profiles/${authObj.uid}`);
        userRef.on('value', snap => {
          // const profileData = snap.val(); //profile data is data of database
          const { name, createdAt } = snap.val();
          const data = {
            name,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });
      } else {
        //Unsubscribing
        if (userRef) {
          userRef.off();
        }
        setProfile(null);
        setIsLoading(false);
      }
    });
    //This is cleanup func for useeffect whwen component in unmounted
    return () => {
      authUnsubscribe();

      if (userRef) {
        userRef.off();
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
