const functions = require('firebase-functions');
const admin = require("firebase-admin");
const { user } = require('firebase-functions/lib/providers/auth');
// Accessing database from server rather than from client
const database=admin.database();
const messaging= admin.messaging();

//data is the one parsed which we get from request
//checking person who tries to access is authenticated user is parsed means present
exports.sendFcm= functions.https.onCall(async(data, context)=>{
    checkIfAuth(context);

    const {chatId, title, message}=data;
    const roomSnap=await database.ref(`/rooms/${chatId}`).once('value');

    if(!roomSnap.exists()){
        return false;
    }

    const roomData=roomSnap.val();
    checkIfAllowed(context, transformToArr(roomData.admins));
    const fcmUsers= transformToArr(roomData.fcmUsers);
    const userTokensPromises= fcmUsers.map(uid=>getUserTokens(uid));
    const userTokensResult= await Promise.all(userTokensPromises);

    //This is used to flatten array bcz array was [[5214], [6622], [6622]]
    const tokens= userTokensResult.reduce((accTokens, userTokens)=>[...accTokens, ...userTokens],[]);

    if(tokens.length===0){
        return false;
    }

    const fcmMessage = {
        notification:
         {title: `${title} (${roomData.name})`,
        body: message},
        tokens,
      }
})

const batchResponse= await messaging.sendMulticast(fcmMessage);
const failedTokens = [];

if (batchResponse.failureCount > 0) {
    
    batchResponse.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(tokens[idx]);
      }
    });
  }

  //Delete multiple tokens from database
  const removePromises= failedTokens.map(token => database.ref(`/fcm_tokens/${token}`).remove());
return Promise.all(removePromises).catch(err=> err.message);


function checkIfAuth(context){
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You have to be signed in'
        );
    }
}

function checkIfAllowed(context, chatAdmins){
    if(!chatAdmins.includes(context.auth.uid)){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Restricted access'
        )
    }
}

function transformToArr(snapVal) {
    return snapVal ? Object.keys(snapVal) : [];
  }

async function getUserTokens(uid){
    const userTokensSnap= await database.ref(`/fcm_tokens`).orderByValue().equalTo(uid).once('value');

    if(!userTokensSnap.hasChildren()){
        return [];
    }
    return Object.keys(userTokensSnap.val());
}  
  