import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import * as ExpoCalendar from "expo-calendar";
import { Calendar as RNCalendar } from "react-native-calendars";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { Colors } from "../../../constants/Colors";

const AppointmentBooking = () => {
  const route = useRoute();
  const { doctor } = route.params;
  const parsedDoctor = JSON.parse(doctor);

  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsFetched, setSlotsFetched] = useState(false);
  const [calendarId, setCalendarId] = useState(null);

  // request calender permisions to proceed with appointment booking
  useEffect(() => {
    (async () => {
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await ExpoCalendar.getCalendarsAsync(
          ExpoCalendar.EntityTypes.EVENT
        );

        const existingCalendar = calendars.find(
          (cal) => cal.title === "Expo Calendar"
        );
        if (existingCalendar) {
          setCalendarId(existingCalendar.id);
        } else {
          const newCalendarId = await createCalendar();
          setCalendarId(newCalendarId);
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Calendar access is required to manage appointments."
        );
      }

      //request  for notification permission
      setNotificationHandler();
      await registerForPushNotificationsAsync();
    })();
  }, []);

  // create the calender
  const createCalendar = async () => {
    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Expo Calendar" };

    const newCalendarID = await ExpoCalendar.createCalendarAsync({
      title: "Expo Calendar",
      color: "blue",
      entityType: ExpoCalendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: "internalCalendarName",
      ownerAccount: "personal",
      accessLevel: ExpoCalendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarID;
  };

  const getDefaultCalendarSource = async () => {
    const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  };

  // function that finds all slots for that particular doctor on that particular date, this ensures that we do not show slots that have already been booked.
  const fetchBookedSlots = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKED_API_URL}/appointment/check-availability`,
        {
          params: {
            doctor_id: parsedDoctor._id,
            date: selectedDate,
          },
        }
      );
      const data = response.data;
      let temp = data.map((item) => item.timeSlot);
      setBookedSlots(temp || []);
      setSlotsFetched(true);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      Alert.alert("Error", "Failed to fetch booked slots.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, parsedDoctor._id]);

  // call the fetchBookedSlots function everytime the date is changed
  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      setSlotsFetched(false);
      fetchBookedSlots();
    }
  }, [selectedDate, fetchBookedSlots]);

  // function that generates slots for a particular date, by default we provide slots from 9 to 12, and 3 to 5.
  // this function ensures we do not show the booked slots to users
  const generateSlots = () => {
    const slots = [];
    const timeRanges = [
      { start: "09:00", end: "12:00" },
      { start: "15:00", end: "17:00" },
    ];

    timeRanges.forEach(({ start, end }) => {
      let [startHour, startMinute] = start.split(":").map(Number);
      let [endHour, endMinute] = end.split(":").map(Number);

      while (
        startHour < endHour ||
        (startHour === endHour && startMinute < endMinute)
      ) {
        const slotTime = `${startHour.toString().padStart(2, "0")}:${startMinute
          .toString()
          .padStart(2, "0")}`;
        const formattedSlot = `${slotTime}-${
          startMinute + 30 >= 60
            ? (startHour + 1).toString().padStart(2, "0")
            : startHour.toString().padStart(2, "0")
        }:${
          (startMinute + 30) % 60 === 0
            ? "00"
            : (startMinute + 30).toString().padStart(2, "0")
        }`;
        if (!bookedSlots.includes(formattedSlot)) {
          slots.push(formattedSlot);
        }
        startMinute += 30;
        if (startMinute >= 60) {
          startMinute = 0;
          startHour += 1;
        }
      }
    });

    return slots;
  };
  const [isBooking, setIsBooking] = useState(false);

  const handleSlotPress = (slot) => {
    Alert.alert(
      "Confirm Appointment",
      `Do you want to book an appointment for ${slot}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => bookAppointment(slot),
        },
      ]
    );
  };
  // function that handles the appointment booking process
  const bookAppointment = async (slot) => {
    if (!calendarId) {
      Alert.alert("Error", "Calendar not available");
      return;
    }

    setIsBooking(true); // Show loader

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKED_API_URL}/appointment/book`,
        {
          doctor_id: parsedDoctor._id,
          appointmentDate: selectedDate,
          timeSlot: slot,
        }
      );

      if (response.status === 201) {
        const [startTime, endTime] = slot.split("-");
        const appointmentDate = new Date(`${selectedDate}T${startTime}:00`);
        const endDate = new Date(`${selectedDate}T${endTime}:00`);

        const eventId = await ExpoCalendar.createEventAsync(calendarId, {
          title: `Appointment with ${parsedDoctor.doctorName}`,
          startDate: appointmentDate,
          endDate: endDate,
          timeZone: "GMT",
          location: parsedDoctor.hospitalName,
        });

        await scheduleAppointmentNotification(
          appointmentDate,
          parsedDoctor.doctorName,
          parsedDoctor.location.coordinates[1],
          parsedDoctor.location.coordinates[0]
        );

        Alert.alert("Success", "Appointment booked successfully!");
      } else if (response.status === 400) {
        Alert.alert(
          "Slot Already Booked",
          response.data.message || "The selected time slot is already booked."
        );
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to book appointment"
        );
      }

      fetchBookedSlots();
    } catch (error) {
      if (error.message === "Request failed with status code 400") {
        Alert.alert(
          "Slot Already Booked",
          "The selected time slot is already booked."
        );
      } else {
        Alert.alert("Error", "An error occurred while booking the appointment");
      }
      fetchBookedSlots();
    } finally {
      setIsBooking(false); // Hide loader
    }
  };

  // request for push notificaitons, so that users can be notified 1 hour before the appointment time
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: Colors.bgColor(0.5),
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  // function to schedule the notification for 1 hour prior to appointment time
  async function scheduleAppointmentNotification(
    appointmentDate,
    doctorName,
    latitude,
    longitude
  ) {
    const notificationDate = new Date(appointmentDate);
    notificationDate.setHours(notificationDate.getHours() - 1); // 1 hour before appointment

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Upcoming Appointment Reminder",
                body: `You have an appointment with ${doctorName} in 1 hour.`,
                data: {
                    appointmentDate: appointmentDate,
                    latitude: latitude,
                    longitude: longitude,
                },
            },
            trigger: {
                type: 'date',
                date: new Date(appointmentDate),
            },
        });
    }

  function setNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data.latitude && data.longitude) {
        const url = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
        Linking.openURL(url);
      }
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        backgroundColor={Colors.bgColor(1)}
        barStyle={"light-content"}
      />
      <View>
        <Text
          className="text-3xl font-bold mx-8 mt-3"
          style={{ color: Colors.bgColor(0.8) }}
        >
          Scheduler
        </Text>
        <Text className="text-sm text-gray-400 mx-8 mb-5">
          Schedule your appointment with Clynic
        </Text>
      </View>
      <ScrollView
        className="flex-1 p-5 pt-2 bg-white"
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white p-5 mb-4 rounded-lg shadow-lg gap-1 py-2">
          <Text
            className="text-xl font-bold"
            style={{ color: Colors.bgColor(0.8) }}
          >
            {parsedDoctor.doctorName}
          </Text>
          <Text className="text-sm text-neutral-500">
            {parsedDoctor.specialization}
          </Text>
          <Text className="text-sm text-neutral-500">
            {parsedDoctor.hospitalName}, {parsedDoctor.hospitalAddress}
          </Text>
          <Text className="text-lg text-neutral-700">
            ₹ {parsedDoctor.fees}
          </Text>
        </View>

        <View className="mb-4">
          <RNCalendar
            className=""
            current={new Date().toISOString().split("T")[0]}
            minDate={
              new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0]
            }
            maxDate={
              new Date(new Date().setDate(new Date().getDate() + 15))
                .toISOString()
                .split("T")[0]
            }
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setLoading(true);
              setSlotsFetched(false);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: Colors.bgColor(0.8),
              },
            }}
          />
        </View>

        {selectedDate && (
          <View>
            <Text className="text-xl text-gray-600 font-semibold mb-2">
              Available Slots:
            </Text>
            {loading || isBooking ? (
              <Text className="text-gray-500 text-start text-sm">
                Loading...
              </Text>
            ) : slotsFetched ? (
              generateSlots().length > 0 ? (
                <View className="flex-wrap flex-row justify-between gap-y-3">
                  {generateSlots().map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      className="p-3 rounded-lg w-[47%]"
                      style={{ backgroundColor: Colors.bgColor(0.8) }}
                      onPress={() => handleSlotPress(slot)}
                    >
                      <Text className="text-white text-center text-base font-poppins-medium">
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text
                  className="text-center"
                  style={{ color: Colors.bgColor(0.8) }}
                >
                  No slots available
                </Text>
              )
            ) : null}
          </View>
        )}

        {!selectedDate && (
          <Text
            className="text-sm text-center"
            style={{ color: Colors.bgColor(0.8) }}
          >
            Please select a date to view available slots.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentBooking;
