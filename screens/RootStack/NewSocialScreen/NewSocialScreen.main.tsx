import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example.
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example.
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import { getApp } from "firebase/app";
import { getFirestore, setDoc, collection, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  /* TODO: Declare state variables for all of the attributes 
           that you need to keep track of on this screen.
    
     HINTS:

      1. There are five core attributes that are related to the social object.
      2. There are two attributes from the Date Picker.
      3. There is one attribute from the Snackbar.
      4. There is one attribute for the loading indicator in the submit button.
  
  */

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState();
  const [eventImage, setEventImage] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSnackbarVisible, setSnackbarVisibility] = useState(false);

  // TODO: Follow the Expo Docs to implement the ImagePicker component.
  // https://docs.expo.io/versions/latest/sdk/imagepicker/

  // TODO: Follow the GitHub Docs to implement the react-native-modal-datetime-picker component.
  // https://github.com/mmazzarolo/react-native-modal-datetime-picker

  // TODO: Follow the SnackBar Docs to implement the Snackbar component.
  // https://callstack.github.io/react-native-paper/snackbar.html

  const saveEvent = async () => {
    // TODO: Validate all fields (hint: field values should be stored in state variables).
    // If there's a field that is missing data, then return and show an error
    // using the Snackbar.

    // Otherwise, proceed onwards with uploading the image, and then the object.

    if (eventName && eventDescription && eventLocation && eventDate && eventImage) {
      try {

        // NOTE: THE BULK OF THIS FUNCTION IS ALREADY IMPLEMENTED FOR YOU IN HINTS.TSX.
        // READ THIS TO GET A HIGH-LEVEL OVERVIEW OF WHAT YOU NEED TO DO, THEN GO READ THAT FILE!

        // (0) Firebase Cloud Storage wants a Blob, so we first convert the file path
        // saved in our eventImage state variable to a Blob.

        // (1) Write the image to Firebase Cloud Storage. Make sure to do this
        // using an "await" keyword, since we're in an async function. Name it using
        // the uuid provided below.

        // (2) Get the download URL of the file we just wrote. We're going to put that
        // download URL into Firestore (where our data itself is stored). Make sure to
        // do this using an async keyword.

        // (3) Construct & write the social model to the "socials" collection in Firestore.
        // The eventImage should be the downloadURL that we got from (3).
        // Make sure to do this using an async keyword.
        
        // (4) If nothing threw an error, then go back to the previous screen.
        //     Otherwise, show an error.

        const asyncAwaitNetworkRequests = async () => {
          const object = await getFileObjectAsync(eventImage);
          const db = getFirestore();
          const storage = getStorage(getApp());
          const storageRef = ref(storage, uuid() + ".jpg");
          const result = await uploadBytes(storageRef, object as Blob);
          const downloadURL = await getDownloadURL(result.ref);
          const socialDoc: SocialModel = {
            eventName: eventName,
            eventDate: eventDate.getTime(),
            eventLocation: eventLocation,
            eventDescription: eventDescription,
            eventImage: downloadURL,
          };
          const socialRef = collection(db, "socials");
          await setDoc(doc(socialRef), socialDoc);
          console.log("Finished social creation.");
        };

        asyncAwaitNetworkRequests()
          .then(() => {
            console.log("our async function finished running.");
            navigation.navigate("Main");
          })
          .catch((e) => {
            console.log("our async function threw an error:", e);
          });

      } catch (e) {
        console.log("Error while writing social:", e);
      }
    } else {
      setSnackbarVisibility(true);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setEventImage(result.uri);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    setEventDate(date);
    hideDatePicker();
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Add a Social" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        {/* TextInput */}
        <TextInput
          label="Event Name"
          style={styles.textInput}
          value={eventName}
          onChangeText={(text) => setEventName(text)}
        />
        {/* TextInput */}
        <TextInput
          label="Event Location"
          style={styles.textInput}
          value={eventLocation}
          onChangeText={(text) => setEventLocation(text)}
        />
        {/* TextInput */}
        <TextInput
          label="Event Description"
          style={styles.textInput}
          value={eventDescription}
          onChangeText={(text) => setEventDescription(text)}
        />
        {/* Button */}
        {/* Button */}
        <View style={styles.button}>
          <Button mode="outlined" onPress={pickImage}>
            {eventImage ? "Change Image" : "Select Image"}
          </Button>
        </View>
        {/* DateTimePickerModal */}
        <View style={styles.button}>
          <Button mode="outlined" onPress={showDatePicker}>
            {eventDate ? "Change Date" : "Select Date"}
          </Button>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
        {/* Button */}
        <View style={styles.button}>
          <Button mode="contained" onPress={saveEvent}>
            Save Event
          </Button>
        </View>
        {/* Snackbar */}
        <Snackbar
          visible={isSnackbarVisible}
          onDismiss={() => setSnackbarVisibility(false)}
          action={{
            label: 'Dismiss',
            onPress: () => {
              setSnackbarVisibility(false)
            },
          }}>
          Missing data in one or more fields
        </Snackbar>
      </View>
    </>
  );
}
